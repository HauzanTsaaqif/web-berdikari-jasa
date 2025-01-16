import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { collection, doc, getDocs, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../css/dashboard.css";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState("");
  const [infoWeb, setInfoWeb] = useState(null);
  const [allAttendace, setAttendace] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: []
  });
  const [barData, setBarData] = useState({
    labels: [],
    datasets: []
  });

  const username = sessionStorage.getItem('username');

  

  useEffect(() => {
    setBarData({
      labels: ["Loading"], // Tanggal contoh
      datasets: [
        {
          label: "Jumlah Kehadiran",
          data: [100], // Contoh data
          backgroundColor: "#FF8300",
        },
      ],
    });
    setPieData({
    labels: ["Loading"],
    datasets: [
      {
        data: [100], // Contoh data
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  });
    if (username === null) {
      navigate("/login-admin");
    }
  }, [username, navigate]);

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
    const fetchAttendanceData = async () => {
      const attendanceCollectionRef = collection(db, "attendance");
      try {
        const attendanceSnapshot = await getDocs(attendanceCollectionRef);
        const attendanceList = [];
        let hadirCount = 0;
        let izinCount = 0;
        let sakitCount = 0;
  
        // Object untuk menghitung jumlah kehadiran per tanggal
        const dateCount = {};
  
        // Iterasi semua dokumen dalam koleksi attendance
        attendanceSnapshot.docs.forEach((doc, docIndex) => {
          const data = doc.data();
          const keys = Object.keys(data);  // Ambil semua key dari dokumen
  
          keys.forEach((key, keyIndex) => {
            // Jika ada data dalam key tersebut, split data untuk diproses
            const record = data[key] ? data[key].split(";") : [];
  
            // Pastikan record valid dan memiliki 6 bagian
            if (record.length === 6) {
              const [tanggal, nama, divisi, akun, status, keterangan] = record;
              attendanceList.push({
                no: docIndex * keys.length + keyIndex + 1,  // Menghitung no berdasarkan dokumen dan key
                tanggal,
                nama,
                divisi,
                akun,
                status,
                keterangan: keterangan || "-",  // Jika keterangan kosong, beri tanda "-",
              });
              
  
              // Hitung jumlah status
              if (status === "hadir") {
                hadirCount++;
                // Tambahkan ke hitungan kehadiran per tanggal
                dateCount[tanggal] = dateCount[tanggal] ? dateCount[tanggal] + 1 : 1;
              } else if (status === "izin") {
                izinCount++;
              } else if (status === "sakit") {
                sakitCount++;
              }
            }
          });
        });
  
        // Set attendance history
        setAttendanceHistory(attendanceList);
  
        // Hitung total data
        const total = hadirCount + izinCount + sakitCount;
  
        // Hitung persentase masing-masing status
        const hadirPercentage = total ? (hadirCount / total) * 100 : 0;
        const izinPercentage = total ? (izinCount / total) * 100 : 0;
        const sakitPercentage = total ? (sakitCount / total) * 100 : 0;
  
        // Set Pie Data hanya jika ada total yang valid
        if (total > 0) {
          setPieData({
            labels: ["Hadir", "Izin", "Sakit"],
            datasets: [
              {
                data: [hadirPercentage, izinPercentage, sakitPercentage],
                backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
              },
            ],
          });
        } else {
          // Jika tidak ada data, set pieData dengan data kosong
          setPieData({
            labels: ["Loading"],
            datasets: [
              {
                data: [100],
                backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
              },
            ],
          });
        }
  
        // Filter untuk mengambil data hanya 7 hari terakhir
        const today = new Date();
        const last7Days = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const aDay = date.toLocaleDateString('en-GB');
          let separateDay = aDay.split("/");
          let combineDay = `${Number(separateDay[1])}-${Number(separateDay[0])}-${Number(separateDay[2])}`
          last7Days.push(combineDay);
        }
  
        const barLabels = [];
        const barDataValues = [];
        
        last7Days.reverse().forEach((date) => {
          barLabels.push(date);
          barDataValues.push(dateCount[date] || 0);
          
          console.log(dateCount);
          console.log(date);
        });

  
        // Set data untuk chart bar
        setBarData({
          labels: barLabels,
          datasets: [
            {
              label: "Jumlah Kehadiran",
              data: barDataValues,
              backgroundColor: "#FF8300",
            },
          ],
        });
  
      } catch (error) {
        console.error("Error getting attendance documents: ", error);
      }
    };
  
    fetchAttendanceData();
  }, []);
  
  
  

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  

  

  

  const changePage = (page) => {
    setTimeout(() => {
      navigate(`/${page}`, { state: { username: username } });
    }, 100);
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
          <button className="sidebar-logout" onClick={logOut}><i class="fa-solid fa-sign-out-alt"></i><p>Logout</p></button>
        </aside>

        <section className="admin-pages">
          <nav className="navbar">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <span className="navbar-time">{time}</span>
            <div className="navbar-profile" onClick={() => changePage('my-profile-admin')}>
              <i class="fa-solid fa-id-card"></i>
            </div>
          </nav>

          <main className="main-content">
            <div className="dashboard-content">
              <div className="charts-section">
                <div className="chart bar-chart">
                  <h4>Chart Kehadiran Harian</h4>
                  {barData  ? (
                    <Bar data={barData} />
                  ) : (
                    <p>Loading...</p> // Atau komponen loading lainnya
                  )}
                </div>
                <div className="chart pie-chart">
                  <h4>Presentase Kehadiran</h4>
                  {pieData  ? (
                    <Pie data={pieData} />
                  ) : (
                    <p>Loading...</p> // Atau komponen loading lainnya
                  )}
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
