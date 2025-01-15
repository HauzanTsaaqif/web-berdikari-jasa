import React, { useEffect, useState } from 'react';
import { db } from '../FirebaseConfig'; // import konfigurasi Firebase
import { doc, getDoc } from 'firebase/firestore';
import styles from '../css/header.css';
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { FiMenu, FiX } from 'react-icons/fi'; // Ikon dari React Icons

const Header = () => {
  const [data, setData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'web-data', 'web-info'); // Koleksi dan dokumen
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchData();
  }, []);

  return (
    <header className='header'>
      <div className='logo'>
        <img src={data ? data['currentLogo'] : ""} alt="Logo" />
        <h3>{data ? data['companyName'] : ""}</h3>
      </div>
      <div className="menuIcon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul className='navLinks'>
          <li><Link to="/">Beranda</Link></li>
          <li><ScrollLink to="layanan_page" smooth={true} duration={500}>Layanan</ScrollLink></li>
          <li><ScrollLink to="abouth_page" smooth={true} duration={500}>Tentang</ScrollLink></li>
          <li><ScrollLink to="faq_page" smooth={true} duration={500}>FAQ</ScrollLink></li>
        </ul>
        <div className='authButtons'>
          <Link to="/login">
            <button className='loginButton'>Masuk</button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
