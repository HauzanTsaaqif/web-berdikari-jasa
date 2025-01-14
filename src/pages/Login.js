import React, { useState } from "react";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig"; // Pastikan path ini sesuai
import { Link } from "react-scroll";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // 'success' or 'error'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Mendapatkan referensi untuk dokumen 'username'
      const usernameRef = doc(db, "account-data", "username");
      const usernameSnap = await getDoc(usernameRef);
  
      // Memeriksa apakah dokumen username ditemukan
      if (usernameSnap.exists()) {
        const usernames = usernameSnap.data(); // Data username {0: "johndoe", 1: "lana"}
  
        // Mencari apakah input username ada di dalam data username
        const usernameIndex = Object.values(usernames).indexOf(username);
  
        // Jika username ditemukan, ambil password berdasarkan key
        if (usernameIndex !== -1) {
          // Mendapatkan referensi untuk dokumen 'password'
          const passwordRef = doc(db, "account-data", "password");
          const passwordSnap = await getDoc(passwordRef);
  
          // Memeriksa apakah dokumen password ditemukan
          if (passwordSnap.exists()) {
            const passwords = passwordSnap.data(); // Data password {0: "123", 1: "345"}
  
            // Memeriksa apakah password yang dimasukkan sesuai dengan password yang ditemukan
            if (passwords[usernameIndex] === password) {
              setAlertMessage("Login berhasil! Selamat datang.");
              setAlertType("success");
              setTimeout(() => navigate("/my-profile", { state: { usernameIndex } }), 1000);
            } else {
              setAlertMessage("Password salah. Silakan coba lagi.");
              setAlertType("error");
            }
          } else {
            setAlertMessage("Terjadi kesalahan saat memuat data password.");
            setAlertType("error");
          }
        } else {
          setAlertMessage("Username tidak ditemukan. Silakan coba lagi.");
          setAlertType("error");
        }
      } else {
        setAlertMessage("Terjadi kesalahan saat memuat data username.");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
      setAlertMessage("Terjadi kesalahan. Silakan coba lagi nanti.");
      setAlertType("error");
    }
  
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000); // Alert hilang setelah 3 detik
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Login</h1>
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
          <p>Login sebagai admin? <a href="\login-admin">Login</a></p>
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

export default Login;
