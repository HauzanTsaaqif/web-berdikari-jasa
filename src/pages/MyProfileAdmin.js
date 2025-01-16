import React, { useState, useEffect } from "react";
import { db } from '../FirebaseConfig'; // import konfigurasi Firebase
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link,useNavigate,useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../css/dashboard.css";
import "../css/account.css";

const MyProfileAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState("");
  const [infoWeb, setInfoWeb] = useState(null);
  const [accountData, setAccountData] = useState({
    username: "",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const username = sessionStorage.getItem('username');

  useEffect(() => {
        if (username === null) {
        navigate("/login-admin");
        }
    }, [username, navigate]);

  useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        setTime(now.toLocaleTimeString());
      }, 1000);
      return () => clearInterval(interval);
    }, []);
  
    useEffect(() => {
      const fetchData = async () => {
        const infoRef = doc(db, 'web-data', 'web-info');
        const infoSnap = await getDoc(infoRef);
  
        if (infoSnap.exists()) {
          setInfoWeb(infoSnap.data());
        } else {
          console.log('No such document!');
        }
      };
  
      fetchData();
    }, []);

  useEffect(() => {
    // Fetch current user profile data
    const fetchProfile = async () => {
      const userRef = doc(db, 'admin', `account_${username}`); // Ganti dengan ID dokumen yang sesuai
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setAccountData({
            username: userSnap.data().username,
            password: userSnap.data().password,
          });
      } else {
        console.log("No such user document!");
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setNewUsername(accountData.username);
    setNewPassword(accountData.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'admin', `account_${username}`); // Ganti dengan ID dokumen yang sesuai
      await updateDoc(userRef, {
        username: newUsername,
        password: newPassword,
      });
      setAccountData({
        username: newUsername,
        password: newPassword,
      });
      setIsEditing(false);
      alert("Update account success!!")
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const changePage = (page) => {
    navigate(`/${page}`, { state: { username: username } });
  }
  const logOut = () => {
    sessionStorage.removeItem('username');
    
    navigate("/", { replace: true });
  };
  

  return (
    <>
      <div className="dashboard">
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
            <div className="sidebar-header">
            <img src={infoWeb ? infoWeb.currentLogo : ""} alt="Logo" className="sidebar-logo" />
            <h2 className="sidebar-company">{infoWeb ? infoWeb.companyName : ""}</h2>
            </div>
            <ul className="sidebar-menu">
                <li onClick={() => changePage('dashboard')}>
                <i class="fa-solid fa-house-chimney"></i> <p>Dashboard</p>
                </li>
                <li onClick={() => changePage('account')}>
                <i class="fa-solid fa-user-plus"></i> <p>Account</p>
                </li>
                <li onClick={() => changePage('settings')}>
                <i class="fa-solid fa-gear"></i> <p>Settings</p>
                </li>
          </ul>
          <button className="sidebar-logout" onClick={() => logOut()}>
            <i className="fa-solid fa-sign-out-alt"></i>
            <p>Logout</p>
        </button>
        </aside>

        <section className="admin-pages">
          <nav className="navbar">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <span className="navbar-time">{time}</span>
            <div className="navbar-profile">
              <i className="fa-solid fa-id-card"></i>
            </div>
          </nav>

          <main className="main-content">
            <div className="account-content">
              <h4>Profile Admin</h4>

              <div className="profile-details">
                <div>
                  <strong>Username: </strong>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                  ) : (
                    <span>{accountData ? accountData.username : "Loading"}</span>
                  )}
                </div>
                <div>
                  <strong>Password: </strong>
                  {isEditing ? (
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  ) : (
                    <span>{accountData ? showPassword ? accountData.password: "********" : "Loading"}</span>
                  )}
                  <button onClick={togglePasswordVisibility}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {isEditing ? (
                  <div>
                    <button onClick={handleSubmit}>Save Changes</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={handleEditToggle}>Edit Profile</button>
                )}
              </div>

              <div className="back-to-dashboard">
                  <button onClick={() => changePage('dashboard')}>Back to Dashboard</button>
              </div>
            </div>
          </main>
        </section>
      </div>
    </>
  );
};

export default MyProfileAdmin;
