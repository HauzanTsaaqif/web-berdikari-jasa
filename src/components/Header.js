import React, { useEffect, useState } from 'react';
import { db } from '../FirebaseConfig'; // import konfigurasi Firebase
import { doc, getDoc } from 'firebase/firestore';
import styles from '../css/header.css'
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";


const Header = () => {

  const [data, setData] = useState(null);
  
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
        <img src={data ? data['currentLogo'] : ""}/>
        <h3>{data ? data['companyName'] : ""}</h3>
      </div>
      <nav>
        <ul className='navLinks'>
          <li><Link to="/">Beranda</Link></li>
          <li><Link><ScrollLink to="layanan_page">Layanan</ScrollLink></Link></li>
          <li><Link><ScrollLink to="abouth_page">Tentang</ScrollLink></Link></li>
          <li><Link><ScrollLink to="faq_page">FAQ</ScrollLink></Link></li>
        </ul>
      </nav>
      <div className='authButtons'>
      <Link to="/login"><button className='loginButton'>
        Masuk</button></Link>
      </div>
    </header>
  );
};

export default Header;
