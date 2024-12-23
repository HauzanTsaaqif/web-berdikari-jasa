import React from 'react';
import styles from '../css/header.css'

const Header = () => {
  return (
    <header className='header'>
      <div className='logo'>
        <img src={`${process.env.PUBLIC_URL}/logo.png`}/>
        <h3>PT. BERDIKARI JASA PRIMA</h3>
      </div>
      <nav>
        <ul className='navLinks'>
          <li>Beranda</li>
          <li>Tentang</li>
          <li>Layanan</li>
          <li>FAQ</li>
        </ul>
      </nav>
      <div className='authButtons'>
        <button className='loginButton'>Masuk</button>
      </div>
    </header>
  );
};

export default Header;
