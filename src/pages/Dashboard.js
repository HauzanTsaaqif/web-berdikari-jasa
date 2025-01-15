import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { collection, doc, getDocs, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../css/dashboard.css";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState("");
  const [infoWeb, setInfoWeb] = useState(null);
  const location = useLocation();
  const username = location.state?.username;
  const navigate = useNavigate(); // Hook untuk navigasi

  useEffect(() => {
    const fetchData = async () => {
      if (username === undefined){
        console.log("iniiii", username);
      }else{
        console.log("laah");
      }
    };

    fetchData();
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
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pieData = {
    labels: ["Hadir", "Izin", "Sakit"],
    datasets: [
      {
        data: [80, 20, 10], // Contoh data
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

  const barData = {
    labels: ["01 Jan", "02 Jan", "03 Jan", "04 Jan", "05 Jan"], // Tanggal contoh
    datasets: [
      {
        label: "Jumlah Kehadiran",
        data: [50, 45, 60, 55, 70], // Contoh data
        backgroundColor: "#FF8300",
      },
    ],
  };

  const attendanceHistory = [
    { no: 1, tanggal: "01 Jan 2025", nama: "John Doe", divisi: "IT", akun: "johndoe", status: "Hadir", keterangan: "-" },
    { no: 2, tanggal: "01 Jan 2025", nama: "Jane Smith", divisi: "HR", akun: "janesmith", status: "Izin", keterangan: "Urgent" },
    { no: 3, tanggal: "01 Jan 2025", nama: "Jake Lee", divisi: "Finance", akun: "jakelee", status: "Sakit", keterangan: "Flu" },
    // Tambahkan data lainnya sesuai kebutuhan
  ];

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
          <button className="sidebar-logout"><Link to="/">Logout</Link></button>
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
            <div className="dashboard-content">
              <div className="charts-section">
                <div className="chart bar-chart">
                  <h4>Chart Kehadiran Harian</h4>
                  <Bar data={barData} />
                </div>
                <div className="chart pie-chart">
                  <h4>Presentase Kehadiran</h4>
                  <Pie data={pieData} />
                </div>
              </div>
              <div className="table-section">
                <h4>Histori Presensi</h4>
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Tanggal</th>
                      <th>Nama</th>
                      <th>Divisi</th>
                      <th>Akun</th>
                      <th>Status</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory.map((row) => (
                      <tr key={row.no}>
                        <td>{row.no}</td>
                        <td>{row.tanggal}</td>
                        <td>{row.nama}</td>
                        <td>{row.divisi}</td>
                        <td>{row.akun}</td>
                        <td>{row.status}</td>
                        <td>{row.keterangan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
