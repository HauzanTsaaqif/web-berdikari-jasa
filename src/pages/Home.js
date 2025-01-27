import { useEffect, useState } from 'react';

function Home() {
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    // Set timer untuk pengalihan otomatis
    const newTimer = setTimeout(() => {
      window.location.href = 'https://berdikari-jasa-prima.vercel.app/';
    }, 5000);

    // Menyimpan timer di state
    setTimer(newTimer);

    // Membersihkan timer jika komponen di-unmount
    return () => clearTimeout(newTimer);
  }, []);

  const handleCancelRedirect = () => {
    // Membatalkan pengalihan
    if (timer) {
      clearTimeout(timer);
      alert('Pengalihan dibatalkan.');
    }
  };

  return (
    <div className="redirect-page" style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '50px' }}>
      <h1 style={{ fontSize: '2rem', color: '#ff8300', marginBottom: '20px' }}>
        Website Telah Dipindahkan
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px', lineHeight: '1.6' }}>
        Website ini telah dipindahkan ke{' '}
        <a
          href="https://berdikari-jasa-prima.vercel.app/"
          style={{ color: '#007bff', textDecoration: 'underline' }}
        >
          https://berdikari-jasa-prima.vercel.app/
        </a>.
        Anda akan diarahkan secara otomatis dalam 5 detik.
      </p>
      <button
        onClick={handleCancelRedirect}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff8300',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Batalkan Pengalihan
      </button>
    </div>
  );
}

export default Home;
