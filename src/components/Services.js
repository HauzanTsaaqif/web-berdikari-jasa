import React from 'react';
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
  return (
    <section className='services'>
      <h2>Layanan</h2>
      <div className='serviceGrid'>
        {services.map((service, index) => (
          <div key={index} className='card'>
            <img src={service.image} alt={service.title} />
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
