import React, { useState,useEffect } from "react";
import { db } from '../FirebaseConfig'; // import konfigurasi Firebase
import { collection, doc, getDocs, setDoc, updateDoc, Timestamp, getDoc, deleteField } from 'firebase/firestore';
import { BrowserRouter as Router, Link, data } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../css/dashboard.css";
import "../css/account.css";

const Account = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState("");
  const [webData, setWebData] = useState([]);
  const [infoWeb, setInfoWeb] = useState(null);
  const initialData = {
    NIK: "",
    name: "",
    kontak: "",
    divisi: "",
    username: "",
    password: "",
  };
  const [accountData, setAccountData] = useState(initialData);
  
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
    const fetchData = async () => {
      const dataRef = collection(db, 'account-data');
      const querySnapshot = await getDocs(dataRef);

      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      setWebData(documents);
      console.log(documents);
      setAccountData(webData);
      console.log("aaa", accountData);
    };

    fetchData();
  }, []);

  const [accounts, setAccounts] = useState([
    {
      num: 1,
      nik: "",
      nama: "John Doe",
      kontak: "0864237843",
      tanggalLahir: "1990-01-01",
      divisi: "IT",
      username: "johndoe",
      password: "password123",
    },
  ]);
  useEffect(() => {
      if (webData.length > 0) {
        setAccountData({
          NIK: webData[0] || "",
          name: webData[4] || "",
          kontak: webData[3] || "",
          divisi: webData[2] || "",
          username: webData[6] || "",
          password: webData[5] || "",
        });
      }
    }, [webData]);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    num: "",
    NIK: webData[0] || "",
    name: webData[4] || "",
    kontak: webData[3] || "",
    divisi: webData[2] || "",
    username: webData[6] || "",
    password: webData[5] || "",
  });

  const handleEdit = (key) => {
    setFormData({
      num: key,
      NIK: accountData.NIK[key],
      name: accountData.name[key],
      kontak: accountData.kontak[key],
      divisi: accountData.divisi[key],
      username: accountData.username[key],
      password: accountData.password[key],
    });
    setShowForm(true);
  };

  const handleDelete = async (formKey) => {
    try {
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          if (key !== "num") {
            console.log(`${key}: ${formData[key]}`);
            const fieldRef = doc(db, 'account-data', key);
            // Hapus field yang sesuai dengan formKey
            await updateDoc(fieldRef, {
              [formKey]: deleteField(), // Menghapus field
            });
          }
        }
      }

      alert("Fields with the specified formKey have been deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete data.");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.num) {
      setAccounts(accounts.map((account) => (account.num === formData.num ? formData : account)));
    } else {
      // Add new account
      setAccounts([
        ...accounts,
        { ...formData, num: accounts.length ? accounts[accounts.length - 1].num + 1 : 1 },
      ]);
    }
    setShowForm(false);
    setFormData({
      num: "",
      nik: "",
      nama: "",
      kontak: "",
      tanggalLahir: "",
      divisi: "",
      username: "",
      password: "",
    });
  };

  const handleFormCancel = () => {
    
    setShowForm(false);
    setFormData({
      num: "",
      NIK: "",
      name: "",
      kontak: "",
      divisi: "",
      username: "",
      password: "",
    });
  };

  const desctructID = (text) =>{
    const { id, ...textWI } = text;
    return textWI;
  };

  const handleFormUpdate = async (formKey) => { 
    if (!formKey){
      const ansRef = doc(db, 'account-data', 'username');
      const ansSnap = await getDoc(ansRef);
      let maxKey = 0;
      const data = ansSnap.data();
      for (const key in data) {
        const numKey = Number(key);
        if (!isNaN(numKey)) {
          maxKey = Math.max(maxKey, numKey); // Ambil angka terbesar
        }
      }

      maxKey = (maxKey + 1).toString();
      try {
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            if(key !== "num")
              {console.log(`${key}: ${formData[key]}`);
              const fieldRef = doc(db, 'account-data', key);
              await updateDoc(fieldRef, {
              [maxKey] : formData[key],
            });}
          }
        }
    
        alert("Data updated successfully!");
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to update data.");
      }
    }else{
      try {
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            if(key !== "num")
              {console.log(`${key}: ${formData[key]}`);
              const fieldRef = doc(db, 'account-data', key);
              await updateDoc(fieldRef, {
              [formKey] : formData[key],
            });}
          }
        }
    
        alert("Data updated successfully!");
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to update data.");
      }
    }
  
    setShowForm(false);
    setFormData({
      num: "",
      NIK: "",
      name: "",
      kontak: "",
      divisi: "",
      username: "",
      password: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "date") {
      console.log("before", value);
      
      // Mengubah format menjadi dd/mm/yy
      const dateValue = new Date(value).toISOString().split('T')[0];
      setFormData({ ...formData, [name]: dateValue });
  
      console.log("after", dateValue);
      const [day, month, year] = dateValue.split('/');
  
      const fullYear = '20' + year;
      const formattedDate = new Date(`${month}/${day}/${fullYear}`);
      
      // Memeriksa apakah tanggal valid
      if (!isNaN(formattedDate.getTime())) {
        const timestamp = Timestamp.fromDate(formattedDate);
        setFormData({ ...formData, [name]: timestamp });
        console.log("Firestore Timestamp", timestamp);
      } else {
        console.error("Invalid date format");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
          <button className="sidebar-logout" ><Link to="/">Logout</Link></button>
        </aside>

        <section className="admin-pages">
          <nav className="navbar">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <span className="navbar-time">{time}</span>
            <div className="navbar-profile">
              <img src="/profile.jpg" alt="Profile" className="profile-pic" />
            </div>
          </nav>

          <main className="main-content">
            <div className="account-content">
              <h4>Daftar Akun Pegawai</h4>

              <table>
                <thead>
                  <tr>
                    <th>Num</th>
                    <th>NIK</th>
                    <th>Nama Lengkap</th>
                    <th>Kontak</th>
                    <th>Divisi</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {accountData.NIK ? (
                Object.entries(accountData.NIK)
                  .filter(([key]) => key !== "id")
                  .map(([key, value], index) => (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td>{accountData.NIK[index]}</td>
                      <td>{accountData.name[index]}</td>
                      <td>{accountData.kontak[index]}</td>
                      <td>{accountData.divisi[index]}</td>
                      <td>{accountData.username[index]}</td>
                      <td>
                        <span className="password-mask">********</span>{" "}
                        <button
                          onClick={() => alert(`Password: ${accountData.password[index]}`)}
                          className="view-password-btn"
                        >
                          Lihat
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button onClick={() => handleDelete(index)}>Hapus</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p>Loading...</p>
                )}
                </tbody>
              </table>

              <button onClick={() => setShowForm(true)} className="add-account-btn">
                Tambah Akun
              </button>

              {showForm && (
                <form onSubmit={handleFormSubmit} className="account-form">
                  <h4>{formData.num ? "Edit Akun" : "Tambah Akun"}</h4>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    placeholder="NIK"
                    name="NIK"
                    value={formData.NIK}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Kontak"
                    name="kontak"
                    value={formData.kontak}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Divisi"
                    name="divisi"
                    value={formData.divisi}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button type="submit" onClick={() => handleFormUpdate(formData.num)} >Submit</button>
                  <button type="button" onClick={handleFormCancel}>
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </main>
        </section>
      </div>
    </>
  );
};

export default Account;
