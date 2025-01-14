import "../css/footer.css";
import React, { useEffect, useState } from 'react';
import { db } from '../FirebaseConfig'; // import konfigurasi Firebase
import { doc, getDoc } from 'firebase/firestore';

const Footer = () => {

  const [data, setData] = useState(null);
  
  useEffect(() => {
        const fetchData = async () => {
          const docRef = doc(db, 'web-data', 'web-info'); // Koleksi dan dokumen
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            setData(docSnap.data());
            console.log(docSnap.data());
            console.log('Footer!');
          } else {
            console.log('No such document!');
          }
        };
    
        fetchData();
      }, []);

  return (
    <div className="footer">
      {/* Logo dan Nama Perusahaan */}
      <div className="footer-header">
      </div>

      {/* Kontak */}
      <section id="kontak" className="footer-content">
        <div className="contact-grid">
          {/* Informasi Kontak */}
          <div className="contact-info">
            

            <address>
            
            <img
            src={data ? data['currentLogo'] : ""}
            alt="Logo PT. Berdikari Jasa Prima"
            className="footer-logo"
            />

              <p>
                <i className="fas fa-building"></i> <h2 className="company-name font-bold">{data ? data['companyName'] : ""}</h2>
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i> {data ? data['companyAddress'] : ""}
              </p>
              <p>
                <i className="fas fa-envelope"></i> 
                <a href={`mailto:${data ? data['email'] : ''}`} className="contact-link">
                  {data ? data['email'] : ""}
                </a>
              </p>
            </address>
          </div>

          {/* Peta Lokasi */}
          <div className="map-wrapper">
            <h3 className="contact-title">Lokasi Kami</h3>
            <div className="map-container">
              <iframe
                className="map"
                src="https://maps.google.com/maps?q=6°10'34.3'S 106°50'54.3'E&z=15&output=embed"
                title="Lokasi"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bawah */}
      <div className="footer-bottom">
        <p>© 2025 {data ? data['companyName'] : ""}. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
