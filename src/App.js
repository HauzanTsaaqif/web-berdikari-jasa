import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import HomePage from "./pages/Home";
import Dashboard from "./pages/Dashboard"
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import LoginAdmin from "./pages/LoginAdmin";
import MyProfileAdmin from "./pages/MyProfileAdmin";

import React, { useEffect, useState } from 'react';
import { db } from './FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';


function App() {
  const [title, setTitle] = useState("");
  const [favicon, setFavicon] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'web-data', 'web-info');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTitle(docSnap.data()['websiteName']);
        setFavicon(docSnap.data()['currentLogo']);
      } else {
        console.log('No such document!');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update Title dan Favicon di halaman
    if (title) {
      document.title = title; // Update title halaman
    }
    if (favicon) {
      const link = document.querySelector("link[rel='icon']") || document.createElement("link");
      link.rel = "icon";
      link.href = favicon;  // Set Favicon URL
      document.head.appendChild(link);
    }
  }, [title, favicon]);

  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/account" element={<Account/>} />
      <Route path="/settings" element={<Settings/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/my-profile" element={<MyProfile/>} />
      <Route path="/login-admin" element={<LoginAdmin/>} />
      <Route path="/my-profile-admin" element={<MyProfileAdmin/>} />
    </Routes>
  );
}

export default App;
