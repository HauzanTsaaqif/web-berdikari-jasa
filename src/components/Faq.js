import React, { useEffect, useState } from 'react';
import '../css/hero.css';
import { db } from '../FirebaseConfig'; // import konfigurasi Firebase
import { doc, getDoc } from 'firebase/firestore';
import "../css/faq.css"; 

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const [answer, setAnswer] = useState(null);
  const [question, setQuestion] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const ansRef = doc(db, 'web-data', 'answer-list');
        const ansSnap = await getDoc(ansRef);
        const quesRef = doc(db, 'web-data', 'question-list');
        const quesSnap = await getDoc(quesRef);
  
        if (ansSnap.exists()) {
          setAnswer(ansSnap.data());
          console.log(ansSnap.data());
        } else {
          console.log('No such document!');
        }
        if (quesSnap.exists()) {
          setQuestion(quesSnap.data());
          console.log(quesSnap.data());
        } else {
          console.log('No such document!');
        }
      };
  
      fetchData();
    }, []);

  const faqs = [
    {
      question: "Apa saja layanan yang disediakan oleh PT. Berdikari Jasa Prima?",
      answer:
        "Kami menyediakan layanan administrasi kendaraan bermotor seperti perpanjangan STNK, mutasi kendaraan, balik nama, pengurusan KIR, izin bongkar muatan, hingga penyelesaian tilang.",
    },
    {
      question: "Berapa lama waktu yang diperlukan untuk pengurusan dokumen?",
      answer:
        "Proses pengurusan dokumen kendaraan biasanya selesai dalam waktu sekitar 3 hari, tergantung pada jenis layanan yang dipilih.",
    },
    {
      question: "Apakah PT. Berdikari Jasa Prima melayani perusahaan?",
      answer:
        "Ya, kami melayani baik individu maupun perusahaan untuk keperluan administrasi kendaraan bermotor.",
    },
    {
      question: "Bagaimana cara menghubungi PT. Berdikari Jasa Prima?",
      answer:
        "Anda dapat menghubungi kami melalui kontak yang tersedia di situs web atau langsung datang ke kantor kami.",
    },
    {
      question: "Apakah biaya layanan dapat dinegosiasikan?",
      answer: "Kami menawarkan biaya yang terjangkau dan transparan sesuai dengan jenis layanan yang dipilih.",
    },
  ];

  return (
    <div className="faq-page">
      <section id="faq" className="faq-content">
        <h2 id="faq_page" className="faq-title">
          Frequently Asked <span className="highlight">Questions (FAQ)</span>
        </h2>
        <div className="faq-container">
          {question ? (
              Object.entries(question).map(([key, faq], index) => (
                <div key={index} className="faq-item">
                  <div
                    className={`faq-question ${activeIndex === index ? "active" : ""}`}
                    onClick={() => toggleFAQ(index)}
                  >
                    {question[key]}
                    <span className="icon">{activeIndex === index ? "-" : "+"}</span>
                  </div>
                  <div
                    className={`faq-answer ${activeIndex === index ? "show" : ""}`}
                    style={{ maxHeight: activeIndex === index ? "200px" : "0" }}
                  >
                    <p>{answer[key]}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
        </div>
        
      </section>
    </div>
  );
};

export default Faq;
