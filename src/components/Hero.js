import React, { useEffect, useState } from 'react';
import '../css/hero.css';
import { db } from '../FirebaseConfig'; // import konfigurasi Firebase
import { doc, getDoc } from 'firebase/firestore';

const Hero = () => {

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'web-data', 'web-info'); // Koleksi dan dokumen
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchData();
  }, []);

  return (
    <section className='hero'>
      <div className='content'>
        <h1>{data ? data['heroTitle'] : ""}</h1>
        <p>
        {data ? data['heroSubtitle'] : ""}
        </p>
        <button className='contactButton'>Contact Person</button>
      </div>
      <div className='image'>
        <img
          src={data ? data['heroImage'] : ""} // Ganti dengan URL atau path gambar Anda
          alt='Ilustrasi Jasa Pengurusan'
        />
      </div>
    </section>
  );
};

export default Hero;
