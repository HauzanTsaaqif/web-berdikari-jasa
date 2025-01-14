import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, data } from "react-router-dom";
import { db } from '../FirebaseConfig'; // import konfigurasi Firebase
import { doc, getDoc } from 'firebase/firestore';
import '../css/services.css'

const Sidebar = () => {
    const [infoWeb, setInfoWeb] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          const infoRef = doc(db, 'web-data', 'web-info');
          const infoSnap = await getDoc(infoRef);
    
          if (infoSnap.exists()) {
            setInfoWeb(infoSnap.data());
            console.log('No such document!', infoWeb);
          } else {
            console.log('No such document!');
          }
        };
    
        fetchData();
      }, []);

    return (
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
    );
};

export default Sidebar;