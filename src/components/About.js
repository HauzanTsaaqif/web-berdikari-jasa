import React from "react";
import "../css/about.css"; // Import custom CSS

const About = () => {
  return (
    <div className="about-page">
      {/* Section Tentang */}
      <section id="tentang" className="about-content">
        <h2 className="about-title">
          About <span className="highlight">TENTANG</span>
        </h2>
        <p className="section-text">
        PT. Berdikari Jasa Prima adalah perusahaan yang bergerak di bidang pengurusan administrasi kendaraan bermotor, menyediakan layanan lengkap untuk berbagai kebutuhan seperti perpanjangan STNK, mutasi kendaraan, balik nama, pengurusan KIR, izin bongkar muatan, hingga penyelesaian tilang. Dengan komitmen memberikan pelayanan yang cepat, efisien, dan terpercaya, kami melayani baik individu maupun perusahaan. Didukung oleh staf yang profesional dan berpengalaman, kami menjamin proses pengurusan dokumen kendaraan dapat selesai dalam waktu sekitar 3 hari dengan biaya yang terjangkau. PT. Berdikari Jasa Prima hadir sebagai solusi untuk segala keperluan administrasi kendaraan Anda, memastikan proses yang mudah, hemat waktu, dan sesuai dengan regulasi yang berlaku.
        </p>
      </section>

      {/* Dokumentasi */}
      <section id="dokumentasi" className="section-content bg-white">
        <div className="container">
          <h2 className="about-title">
            our <span className="highlight">DOKUMENTASI</span>
          </h2>
          <div className="image-grid">
            <div className="custom-image-wrapper">
              <img src={`${process.env.PUBLIC_URL}/img/Picture4.png`} alt="Dok 1" className="img" />
            </div>
            <div className="custom-image-wrapper">
              <img src={`${process.env.PUBLIC_URL}/img/Picture3.jpg`} alt="Dok 2" className="img" />
            </div>
            <div className="custom-image-wrapper">
              <img src={`${process.env.PUBLIC_URL}/img/Picture5.png`} alt="Dok 3" className="img" />
            </div>
            <div className="custom-image-wrapper">
              <img src={`${process.env.PUBLIC_URL}/img/Picture2.jpg`} alt="Dok 4" className="img" />
            </div>
            <div className="custom-image-wrapper">
              <img src={`${process.env.PUBLIC_URL}/img/Picture1.jpg`} alt="Dok 5" className="img" />
            </div>
            <div className="custom-image-wrapper">
              <img src={`${process.env.PUBLIC_URL}/img/Picture6.jpg`} alt="Dok 6" className="img" />
            </div>
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section id="kontak" className="section-content">
        <div className="contact-grid">
          <div className="contact-info">
            <h3 className="contact-title">Hubungi Kami</h3>
            <p>PT. BERDIKARI JASA PRIMA</p>
            <p>Ruko Selmis Jln. KH Abdullah Syafei Blok 2, No.14</p>
            <p>Email: sampleemail@gmail.com</p>
          </div>
          <div className="map-wrapper">
            <h3 className="contact-title">Lokasi</h3>
            <iframe
              className="map"
              src="https://maps.google.com/maps?q=6°10'34.3'S 106°50'54.3'E&z=15&output=embed"
              title="Lokasi"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;