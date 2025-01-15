import React, { useEffect, useState } from 'react';
import { db } from '../FirebaseConfig'; // import konfigurasi Firebase
import { doc, getDoc } from 'firebase/firestore';
import '../css/services.css'

const services = [
  { title: 'E-tilang', image: `${process.env.PUBLIC_URL}/img/service/1.png`, description: 'Layanan pengurusan terkait pelanggaran lalu lintas berbasis elektronik, memudahkan pengguna untuk menyelesaikan kewajiban tilang secara cepat dan efisien.' },
  { title: 'Tilangan', image: `${process.env.PUBLIC_URL}/img/service/2.png`, description: 'Layanan resmi untuk membantu proses penyelesaian pelanggaran tilang, dengan panduan dan dukungan dari tenaga profesional.' },
  { title: 'STNK/KIR Terblokir atau Hilang', image: `${process.env.PUBLIC_URL}/img/service/1.png`, description: 'Layanan pengurusan STNK atau KIR yang terblokir atau hilang, memastikan dokumen kendaraan Anda dapat kembali aktif dan sah digunakan.' },
  { title: 'Izin Bongkar Muat Kendaraan', image: `${process.env.PUBLIC_URL}/img/service/1.png`, description: 'Layanan pengurusan izin resmi untuk bongkar muat kendaraan, memastikan proses operasional berjalan lancar dan sesuai regulasi.' },
  { title: 'Mutasi', image: `${process.env.PUBLIC_URL}/img/service/1.png`, description: 'Layanan administrasi untuk mutasi kendaraan, baik antar daerah maupun antar pemilik, dilakukan dengan aman dan cepat.' },
  { title: 'Balik Nama', image: `${process.env.PUBLIC_URL}/img/service/1.png`, description: 'Layanan untuk proses balik nama kendaraan, memastikan legalitas dokumen sesuai dengan kepemilikan baru secara resmi dan terpercaya.' },
];

const Services = () => {

  const [ser_title, setSerTitle] = useState(null);
  const [ser_desc, setSerDesc] = useState(null);
  const [ser_img, setSerImg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const titleRef = doc(db, 'web-data', 'service-title');
      const titleSnap = await getDoc(titleRef);
      const descRef = doc(db, 'web-data', 'service-desc');
      const descSnap = await getDoc(descRef);
      const imgRef = doc(db, 'web-data', 'service-img');
      const imgSnap = await getDoc(imgRef);

      if (titleSnap.exists()) {
        setSerTitle(titleSnap.data());
      } else {
        console.log('No such document!');
      }
      if (descSnap.exists()) {
        setSerDesc(descSnap.data());
      } else {
        console.log('No such document!');
      }
      if (imgSnap.exists()) {
        setSerImg(imgSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchData();
  }, []);

  return (
    <section className='services'>
      <h2 id='layanan_page'>Layanan Kami</h2>
      <div className='serviceGrid'>

        {ser_title ? (
            Object.entries(ser_title).map(([key, faq], index) => (
              <div key={index} className='card'>
                <img src={ser_img[key]} alt={ser_title[key]} />
                <h3>{ser_title[key]}</h3>
                <p>{ser_desc[key]}</p>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}

      </div>
    </section>
  );
};

export default Services;
