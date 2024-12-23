import React from 'react';
import '../css/hero.css';

const Hero = () => {
  return (
    <section className='hero'>
      <div className='content'>
        <h1>JASA PENGURUSAN SURAT KENDARAAN, BERMOTOR, CLEANING SERVICE & SECURITY</h1>
        <p>
          PT. BERDIKARI JASA PRIMA dengan tenaga ahli dan profesional dapat memberikan solusi
          dalam hal pengurusan surat kendaraan bermotor dengan resmi, aman, dan cepat.
        </p>
        <button className='contactButton'>Contact Person</button>
      </div>
      <div className='image'>
        <img
          src={`${process.env.PUBLIC_URL}/img/hero.png`} // Ganti dengan URL atau path gambar Anda
          alt='Ilustrasi Jasa Pengurusan'
        />
      </div>
    </section>
  );
};

export default Hero;
