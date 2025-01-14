import React, { useEffect, useState } from 'react';
import { db } from '../FirebaseConfig'; // import konfigurasi Firebase
import { doc, getDoc } from 'firebase/firestore';
import "../css/about.css"; // Import custom CSS

const About = () => {

  const [data, setData] = useState(null);
  const [gallery, setGallery] = useState(null);
    
      useEffect(() => {
        const fetchData = async () => {
          const docRef = doc(db, 'web-data', 'web-info');
          const docSnap = await getDoc(docRef);
          const docRefGal = doc(db, 'web-data', 'gallery');
          const docSnapGal = await getDoc(docRefGal);
    
          if (docSnap.exists()) {
            setData(docSnap.data());
            console.log(docSnap.data());
          } else {
            console.log('No such document!');
          }
          if (docSnapGal.exists()) {
            setGallery(docSnapGal.data());
            console.log(docSnapGal.data());
          } else {
            console.log('No such document!');
          }
        };
    
        fetchData();
      }, []);

  return (
    <div id="abouth_page" className="about-page">
      {/* Section Tentang */}
      <section id="tentang" className="about-content">
        <h2 className="about-title">
          About <span className="highlight">TENTANG</span>
        </h2>
        <p className="section-text">
        {data ? data['aboutText'] : ""}
        </p>
      </section>

      {/* Dokumentasi */}
      <section id="dokumentasi" className="section-content">
        <div className="container">
          <h2 className="about-title">
            our <span className="highlight">DOKUMENTASI</span>
          </h2>
          <div className="image-grid">
            <div className="custom-image-wrapper">
              <img src={gallery ? gallery['img6'] : ""} alt="Dok 1" className="img" />
            </div>
            <div className="custom-image-wrapper">
              <img src={gallery ? gallery['img3'] : ""} alt="Dok 2" className="img" />
            </div>
            <div className="custom-image-wrapper">
              <img src={gallery ? gallery['img5'] : ""} alt="Dok 3" className="img" />
            </div>
            <div className="custom-image-wrapper">
              <img src={gallery ? gallery['img2'] : ""} alt="Dok 4" className="img" />
            </div>
            <div className="custom-image-wrapper">
              <img src={gallery ? gallery['img1'] : ""} alt="Dok 5" className="img" />
            </div>
            <div className="custom-image-wrapper">
              <img src={gallery ? gallery['img4'] : ""} alt="Dok 6" className="img" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;