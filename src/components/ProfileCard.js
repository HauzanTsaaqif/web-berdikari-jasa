import "../css/myProfile.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from '../FirebaseConfig'; 
import { doc, getDoc } from "firebase/firestore";

const ProfileCard = () => {
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const { state } = useLocation();
  const { usernameIndex } = state || {};
  const [userData, setUserData] = useState(null);

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
          const nameSnap = (await getDoc(nameRef));
          const nikRef = doc(db, "account-data", "NIK");
          const nikSnap = (await getDoc(nikRef));
          const divisiRef = doc(db, "account-data", "divisi");
          const divisiSnap = (await getDoc(divisiRef));
          const usernameRef = doc(db, "account-data", "username");
          const usernameSnap = (await getDoc(usernameRef));
          const kontakRef = doc(db, "account-data", "kontak");
          const kontakSnap = (await getDoc(kontakRef));

          if (nameSnap.exists()) {
            const dataName = nameSnap.data()[usernameIndex];
            const dataNik = nikSnap.data()[usernameIndex];
            const dataDivisi = divisiSnap.data()[usernameIndex];
            const dataUsername = usernameSnap.data()[usernameIndex];
            const dataKontak = kontakSnap.data()[usernameIndex];
            setUserData({
              name: dataName,
              nik:dataNik,
              divisi:dataDivisi,
              username:dataUsername,
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

  const handleAttendance = () => {
    const isWithinCompanyArea = Math.random() > 0.5; // Simulasi area perusahaan

    if (isWithinCompanyArea) {
      setAttendanceMessage("Absensi berhasil!");
    } else {
      setAttendanceMessage("Absensi gagal! Anda tidak berada di area perusahaan.");
    }

    setTimeout(() => setAttendanceMessage(""), 3000); // Reset pesan
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
        <button className="attendance-button" onClick={handleAttendance}>
          Absen Sekarang
        </button>
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
    </div>
  );
};

export default ProfileCard;
