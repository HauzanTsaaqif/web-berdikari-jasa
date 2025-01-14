import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../FirebaseConfig';  // Pastikan ini adalah file firebaseConfig.js Anda

const LoginAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // 'success' or 'error'
  const navigate = useNavigate(); // Hook untuk navigasi

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Menentukan referensi ke dokumen dalam koleksi admin
      const docRef = doc(db, "admin", `account_${username}`);
      const docSnap = await getDoc(docRef);

      // Mengecek apakah dokumen ditemukan
      if (docSnap.exists()) {
        const userData = docSnap.data();

        // Memeriksa apakah password yang dimasukkan sesuai
        if (userData.password === password) {
          setAlertMessage("Login berhasil! Selamat datang.");
          setAlertType("success");
          setTimeout(() => {
            navigate("/dashboard", { state: { username: userData.username } });
          }, 1000);
        } else {
          setAlertMessage("Password salah. Silakan coba lagi.");
          setAlertType("error");
        }
      } else {
        setAlertMessage("Username tidak ditemukan. Silakan coba lagi.");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
      setAlertMessage("Terjadi kesalahan. Silakan coba lagi nanti.");
      setAlertType("error");
    }

    // Menghapus alert setelah beberapa detik
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000); // Alert hilang setelah 3 detik
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Admin Login</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {alertMessage && (
          <div className={`alert ${alertType}`}>
            {alertMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginAdmin;
