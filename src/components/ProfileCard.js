import "../css/myProfile.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from '../FirebaseConfig'; 
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

const ProfileCard = () => {
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [status, setStatus] = useState("hadir"); // default "hadir"
  const [keterangan, setKeterangan] = useState("");
  const [isLeaveRequested, setIsLeaveRequested] = useState(false); // Menyimpan apakah form izin sudah ditampilkan
  const { state } = useLocation();
  const { usernameIndex } = state || {};
  const [userData, setUserData] = useState(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString().replace(/\//g, "-")); // Set tanggal saat komponen pertama kali dimuat
  }, []);

  useEffect(() => {
    if (usernameIndex !== undefined) {
      const usernames = ["johndoe", "lana"];
      const passwords = ["123", "345"];
      
      const username = usernames[usernameIndex];
      const password = passwords[usernameIndex];

      // Query Firestore untuk mengambil data user berdasarkan username dan password
      const fetchData = async () => {
        try {
          const nameRef = doc(db, "account-data", "name");
          const nameSnap = await getDoc(nameRef);
          const nikRef = doc(db, "account-data", "NIK");
          const nikSnap = await getDoc(nikRef);
          const divisiRef = doc(db, "account-data", "divisi");
          const divisiSnap = await getDoc(divisiRef);
          const usernameRef = doc(db, "account-data", "username");
          const usernameSnap = await getDoc(usernameRef);
          const kontakRef = doc(db, "account-data", "kontak");
          const kontakSnap = await getDoc(kontakRef);

          if (nameSnap.exists()) {
            const dataName = nameSnap.data()[usernameIndex];
            const dataNik = nikSnap.data()[usernameIndex];
            const dataDivisi = divisiSnap.data()[usernameIndex];
            const dataUsername = usernameSnap.data()[usernameIndex];
            const dataKontak = kontakSnap.data()[usernameIndex];
            setUserData({
              name: dataName,
              nik: dataNik,
              divisi: dataDivisi,
              username: dataUsername,
              kontak: dataKontak
            });
            console.log(userData);
          } else {
            console.log("Dokumen tidak ditemukan.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchData();
    }
  }, [usernameIndex]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleAttendance = async () => {
    const isWithinCompanyArea = Math.random() > 0.1;
    
    if (isWithinCompanyArea) {
      try {
        console.log(today);
        const attendanceRef = doc(db, "attendance", today);
        const attendanceSnap = await getDoc(attendanceRef);
        
        let attendanceData = attendanceSnap.exists() ? attendanceSnap.data() : {};
        console.log(attendanceData);
    
        if (!attendanceSnap.exists()) {
          await setDoc(attendanceRef, {});
        }

        let maxKey = 0;
        for (const key in attendanceData) {
          const numKey = Number(key);
          if (!isNaN(numKey)) {
            maxKey = Math.max(maxKey, numKey);
          }
        }
        const newKey = (maxKey + 1).toString(); // Key baru berdasarkan urutan
        await updateDoc(attendanceRef, {
          [newKey]: `${today};${userData.name};${userData.divisi};${userData.username};${status};${"-"}`,
        });
  
        alert("Permintaan izin berhasil dikirim!");
        setStatus("hadir");
        setKeterangan("");
      } catch (error) {
        console.error("Error updating attendance:", error);
        alert("Gagal mengirim permintaan izin.");
      }
      setAttendanceMessage("Absensi berhasil!");
    } else {
      setAttendanceMessage("Absensi gagal! Anda tidak berada di area perusahaan.");
    }

    setTimeout(() => setAttendanceMessage(""), 3000);
  };

  const handleLeaveRequest = async () => {

    try {
      const attendanceRef = doc(db, "attendance", today);
      const attendanceSnap = await getDoc(attendanceRef);
      
      let attendanceData = attendanceSnap.exists() ? attendanceSnap.data() : {};
      
      let maxKey = 0;
      for (const key in attendanceData) {
        const numKey = Number(key);
        if (!isNaN(numKey)) {
          maxKey = Math.max(maxKey, numKey);
        }
      }
      const newKey = (maxKey + 1).toString(); // Key baru berdasarkan urutan

      await updateDoc(attendanceRef, {
        [newKey]: `${today};${userData.name};${userData.divisi};${userData.username};${status};${keterangan || "-"}`,
      });

      alert("Permintaan izin berhasil dikirim!");
      setStatus("hadir");
      setKeterangan("");
      setIsLeaveRequested(false);  // Menyembunyikan form izin
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Gagal mengirim permintaan izin.");
    }
  };

  return (
    <div className="profile-page">
      <h2 className="profile-title">My Profile</h2>

      {/* Card Profil */}
      <div className="profile-card">
        <div className="profile-details">
          <p><strong>NIK:</strong> {userData.nik ? userData.nik : ""}</p>
          <p><strong>Nama Lengkap:</strong> {userData.name ? userData.name : ""}</p>
          <p><strong>Divisi:</strong> {userData.divisi ? userData.divisi : ""}</p>
          <p><strong>Username:</strong> {userData.username ? userData.username : ""}</p>
          <p><strong>Kontak:</strong> {userData.kontak ? userData.kontak : ""}</p>
        </div>
      </div>

      {/* Bagian Absensi */}
      <div className="attendance-section">
        <h3 className="attendance-title">Kriteria Absensi</h3>
        <ul className="attendance-criteria">
          <li>Absensi hanya dapat dilakukan di area perusahaan.</li>
          <li>Pastikan perangkat Anda memiliki GPS yang aktif.</li>
          <li>Waktu absensi: 08.00 - 09.00 WIB.</li>
        </ul>
        <div className="leave-buttons">
            <button className="attendance-button" onClick={handleAttendance}>
              Absen Sekarang
            </button>
            <button 
              className="leave-button" 
              onClick={() => setIsLeaveRequested(true)}
            >
              Izin
            </button>
        </div>
        
        {attendanceMessage && (
          <div
            className={`attendance-message ${
              attendanceMessage.includes("berhasil") ? "success" : "error"
            }`}
          >
            {attendanceMessage}
          </div>
        )}
      </div>

      {/* Bagian Izin */}
      <div className="leave-request-section">
        
        {isLeaveRequested && (
          <div className="leave-form">
          <h3>Permintaan Izin</h3>
            <div>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="izin"
                  checked={status === "izin"}
                  onChange={() => setStatus("izin")}
                />
                Izin
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="sakit"
                  checked={status === "sakit"}
                  onChange={() => setStatus("sakit")}
                />
                Sakit
              </label>
            </div>
            <textarea
              placeholder="Keterangan"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />
            <div className="leave-buttons">
              <button className="leave-submit" onClick={handleLeaveRequest}>
                Kirim Permintaan Izin
              </button>
              <button className="leave-cancel" onClick={() => setIsLeaveRequested(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
