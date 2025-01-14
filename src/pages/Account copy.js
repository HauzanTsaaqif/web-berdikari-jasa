import React, { useState,useEffect } from "react";
import { db } from '../FirebaseConfig'; // import konfigurasi Firebase
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { BrowserRouter as Router, Link } from "react-router-dom";
import "../css/dashboard.css";
import "../css/account.css";

const Account = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState("");
  const [webData, setWebData] = useState([]);
  
  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
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
      console.log(documents[0][0]);
    };

    fetchData();
  }, []);

  const [accountsData, setAccounts] = useState(
    {
      num: 1,
      nik: webData[0] || "",
      nama: webData[1] || "",
      kontak: webData[4] || "",
      tanggalLahir: webData[2] || "",
      divisi: webData[3] || "",
      username: webData[6] || "",
      password: webData[5] || "",
    }
  );
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    num: "",
    nik: "",
    nama: "",
    kontak: "",
    tanggalLahir: "",
    divisi: "",
    username: "",
    password: "",
  });

  const handleEdit = (account) => {
    setFormData(account);
    setShowForm(true);
  };

  const handleDelete = (num) => {
    setAccounts(accountsData.filter((account) => account.num !== num));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.num) {
      // Update existing account
      setAccounts(accountsData.map((account) => (account.num === formData.num ? formData : account)));
    } else {
      // Add new account
      setAccounts([
        ...accountsData,
        { ...formData, num: accountsData.length ? accountsData[accountsData.length - 1].num + 1 : 1 },
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
      nik: "",
      nama: "",
      kontak: "",
      tanggalLahir: "",
      divisi: "",
      username: "",
      password: "",
    });
  };

  return (
    <>
      <div className="dashboard">
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <img src="/logo.png" alt="Logo" className="sidebar-logo" />
            <h2 className="sidebar-company">PT. BERDIKARI JASA PRIMA</h2>
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
          <button className="sidebar-logout">Logout</button>
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
                    <th>Tanggal Lahir</th>
                    <th>Divisi</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {accountsData ? (
                Object.entries(accountsData[0])
                .filter(([key]) => key !== "id")
                .map(([key, value], index) => (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td>{accountsData.nik}</td>
                      <td>{accountsData.nama}</td>
                      <td>{accountsData.kontak}</td>
                      <td>{accountsData.tanggalLahir}</td>
                      <td>{accountsData.divisi}</td>
                      <td>{accountsData.username}</td>
                      <td>
                        <span className="password-mask">********</span>{" "}
                        <button
                          onClick={() => alert(`Password: ${accountsData.password}`)}
                          className="view-password-btn"
                        >
                          Lihat
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleEdit(accountsData)}>Edit</button>
                        <button onClick={() => handleDelete(accountsData.num)}>Hapus</button>
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
                    placeholder="Nama Lengkap"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="NIK"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Kontak"
                    value={formData.kontak}
                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Divisi"
                    value={formData.divisi}
                    onChange={(e) => setFormData({ ...formData, divisi: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    required
                  />
                  <button type="submit">Submit</button>
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
