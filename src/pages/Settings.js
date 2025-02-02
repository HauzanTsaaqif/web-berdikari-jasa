import React, { useEffect, useState } from 'react';
import { db } from '../FirebaseConfig';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { BrowserRouter as Router, Link, useLocation, useNavigate } from "react-router-dom";
import "../css/dashboard.css";
import "../css/settings.css"
import { uploadImage } from '../UploadImage';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [webData, setWebData] = useState([]);
  const [logoCompany, setLogoCompany] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [serviceData, setServiceData] = useState(webData);
  const [galleryData, setGalleryData] = useState(webData);
  const [questionData, setQuestionData] = useState(webData);
  const [answerData, setAnswerData] = useState(webData);
  const [time, setTime] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const username = sessionStorage.getItem('username');

  useEffect(() => {
    if (username === null) {
      navigate("/login-admin");
    }
  }, [username, navigate]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = collection(db, 'web-data');
      const querySnapshot = await getDocs(dataRef);

      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      setWebData(documents);
      console.log(documents);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (webData.length > 0) {
      setServiceData(webData || "");
      setGalleryData(webData[1] || "");
      setQuestionData(webData[2] || "");
      setAnswerData(webData[0] || "");
      setFormData({
        websiteName: webData[6]['websiteName'] ||  "",
        companyName: webData[6]['companyName'] || '',
        companyAddress: webData[6]['companyAddress'] || '',
        companyEmail: webData[6]['companyEmail'] || '',
        currentLogo: webData[6]['currentLogo'] || '',
        heroImage: webData[6]['heroImage'] || '',
        heroTitle: webData[6]['heroTitle'] || '',
        heroSubtitle: webData[6]['heroSubtitle'] || '',
        aboutText: webData[6]['aboutText'] || '',
        email: webData[6]['email'] || [],
      });
    }
  }, [webData]);
  

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'web-data', 'web-info');
      await setDoc(docRef, formData);
  
      alert("Data berhasil diupdate!");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Terjadi kesalahan saat memperbarui data.");
    }
  };

  // Contoh data awal untuk input form
  const initialData = {
    websiteName: "Website Berdikari",
    companyName: "PT. BERDIKARI JASA PRIMA",
    companyAddress: "Jl. Raya Semarang No. 123",
    companyEmail: "info@berdikarijasa.com",
    coordinates: "-7.005145, 110.438125",
    currentLogo: "/logo.png",
    heroImage: "/hero.jpg",
    heroTitle: "Selamat Datang di Berdikari",
    heroSubtitle: "Melayani Anda dengan Sepenuh Hati",
    aboutText: "Berdikari adalah perusahaan jasa terbaik."
  };
  const [formData, setFormData] = useState(initialData);


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  const handleFileLogo = async (e, key) => {
    const file = e.target.files[0]; 
  
    try {
      const logoUrl = await uploadImage(file); // Gunakan file langsung untuk diunggah
      setFormData({ ...formData, [key]: logoUrl });
      alert('Logo changed successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image.');
    }
  };
  

  const handleFileHero = (e, key) => {
    setHeroImage(e.target.files[0]);
  };

  const [galleryImages, setGalleryImages] = useState({});

  const handleGallery = (event, key) => {
    const file = event.target.files[0];
    if (file) {
      setGalleryImages((prev) => ({
        ...prev,
        [key]: file,
      }));
    }
  };

  const uploadAllImages = async () => {
    try {
      const uploadPromises = Object.entries(galleryImages).map(
        async ([key, file]) => {
          const response = await uploadImage(file, key); // Gunakan fungsi uploadImage
          return { key, url: response.secure_url };
        }
      );

      const results = await Promise.all(uploadPromises);

      console.log("Uploaded Images:", results);
      alert("All images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images.");
    }
  };

  const handleServiceUpdate = async (key, field, value, type) => {
    if (type === 4) {
      if (!value.target || !value.target.files || !value.target.files[0]) {
        console.error("File input is invalid or not provided.");
        alert("Please select a valid file.");
        return;
      }
  
      console.log("Key:", key, "Field:", field, "File:", value.target.files[0]);
      try {
        const uploadPromises = Object.entries(serviceData[4]).map(
          async ([keyFile, file]) => {
            if (Number(keyFile) === key) {
              const response = await uploadImage(value.target.files[0], key);
              setServiceData((prevData) => ({
                ...prevData,
                [type]: {
                  ...prevData[type],
                  [key]: response,
                },
              }));
            }
          }
        );
  
        await Promise.all(uploadPromises); // Tunggu semua upload selesai
        alert("All images uploaded successfully!");
      } catch (error) {
        console.error("Error uploading images:", error);
        alert("Failed to upload images.");
      }
    } else {
      setServiceData((prevData) => ({
        ...prevData,
        [type]: {
          ...prevData[type],
          [key]: value,
        },
      }));
    }
  };
  
  

  const desctructID = (text) =>{
    const { id, ...textWI } = text;
    return textWI;
  };

  const handleServiceData = async () => {
    try {
      const serviceTitleWI = desctructID(serviceData[5]);
      const titleRef = doc(db, 'web-data', 'service-title'); // Ganti dengan ID dokumen yang sesuai
      await updateDoc(titleRef, {
        ...serviceTitleWI,
      });
      const serviceDescWI = desctructID(serviceData[3]);
      const descRef = doc(db, 'web-data', 'service-desc');
      await updateDoc(descRef, {
        ...serviceDescWI,
      });
      const serviceImgWI = desctructID(serviceData[4]);
      const imgRef = doc(db, 'web-data', 'service-img');
      await updateDoc(imgRef, {
        ...serviceImgWI,
      });

      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update data.");
    }
  };

  const handleImgGallery = (e, key) => {
    console.log("Key:", key, "Value:", e.target.files[0]);
    try {
      const uploadPromises = Object.entries(galleryData).map(
        async ([keyFile, file]) => {
          if (keyFile === key){
            const response = await uploadImage(e.target.files[0], key);
            setGalleryData(prevData => ({
              ...prevData,
              [keyFile]: response,
            }));
          }
        }
      );
      
      console.log("bbb", galleryData);
      alert("All images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images.");
    }
  };

  const handleChangeFaq = async (key, value, type) => {
    console.log("Key:", key, "Value:", value);
    if(type === 0){
      setQuestionData(prevData => ({
        ...prevData,
        [key]: value,
      }));
    }else{
      setAnswerData(prevData => ({
        ...prevData,
        [key]: value,
      }));

    }
  };

  const saveGallery = async () => {
    try {
      const imgGalleryWI = desctructID(galleryData);
      const galleryRef = doc(db, 'web-data', 'gallery'); // Ganti dengan ID dokumen yang sesuai
      await updateDoc(galleryRef, {
        ...imgGalleryWI,
      });

      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update data.");
    }
  };

  const saveFAQ = async () => {
    try {
      const questionWI = desctructID(questionData);
      const questionRef = doc(db, 'web-data', 'question-list'); // Ganti dengan ID dokumen yang sesuai
      await updateDoc(questionRef, {
        ...questionWI,
      });
      const answerWI = desctructID(answerData);
      const answerRef = doc(db, 'web-data', 'answer-list'); // Ganti dengan ID dokumen yang sesuai
      await updateDoc(answerRef, {
        ...answerWI,
      });

      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update data.");
    }
  };

  const changePage = (page) => {
    navigate(`/${page}`, { state: { username: username } });
  }
  const logOut = () => {
    sessionStorage.removeItem('username');
    
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img src={formData ? formData.currentLogo : ""} alt="Logo" className="sidebar-logo" />
          <h2 className="sidebar-company">{formData ? formData.companyName : ""}</h2>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => changePage('dashboard')}>
            <i class="fa-solid fa-house-chimney"></i> <p>Dashboard</p>
          </li>
          <li onClick={() => changePage('account')}>
            <i class="fa-solid fa-user-plus"></i> <p>Account</p>
          </li>
          <li onClick={() => changePage('settings')}>
            <i class="fa-solid fa-gear"></i> <p>Settings</p>
          </li>
        </ul>
        <button className="sidebar-logout" onClick={logOut}><i class="fa-solid fa-sign-out-alt"></i><p>Logout</p></button>
      </aside>

      <section className="admin-pages">
      <nav className="navbar">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <span className="navbar-time">{time}</span>
        <div className="navbar-profile" onClick={() => changePage('my-profile-admin')}>
          <i class="fa-solid fa-id-card"></i>
        </div>
      </nav>
        {webData.length > 0 ? (
          <main className="main-content">

            <div className="account-form">
            <h3>Setting Informasi Website</h3>
              <label>Nama Website</label>
              <input type="text" name="websiteName" value={formData.websiteName} onChange={handleInputChange} />

              <label>Nama Perusahaan</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} />

              <label>Alamat Perusahaan</label>
              <input type="text" name="companyAddress" value={formData.companyAddress} onChange={handleInputChange} />

              <label>Email Perusahaan</label>
              <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleInputChange} />

              <label>Koordinat</label>
              <input type="text" name="coordinates" value={formData.coordinates} onChange={handleInputChange} />

              <label>Logo Perusahaan</label>
              <div className="file-upload">
                <img src={formData.currentLogo} alt="Current Logo" className="preview-logo" />
                <input type="file" onChange={(e) => handleFileLogo(e, "currentLogo")} />
              </div>

              <label>Gambar Hero</label>
              <div className="file-upload">
                <img src={formData.heroImage} alt="Hero" className="preview-hero" />
                <input type="file" onChange={(e) => handleFileLogo(e, "heroImage")} />
              </div>

              <label>Judul Hero</label>
              <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleInputChange} />

              <label>Subjudul Hero</label>
              <input type="text" name="heroSubtitle" value={formData.heroSubtitle} onChange={handleInputChange} />

              <label>Edit About</label>
              <textarea className="about_textarea" name="aboutText" value={formData.aboutText} onChange={handleInputChange}></textarea>
            </div>

            <button className="update-button" onClick={handleUpdate}>Update</button>

            

            <h3>Tabel Update Layanan</h3>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Nama Layanan</th>
            <th>Deskripsi Layanan</th>
            <th>Gambar Layanan</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {serviceData[5] ? (
            Object.entries(serviceData[5])
              .filter(([key]) => key !== "id")
              .map(([key, value], index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={serviceData[5][index]}  // Mengakses nama layanan
                      onChange={(e) => handleServiceUpdate(index, "name", e.target.value, 5)}
                    />
                  </td>
                  <td>
                    <textarea
                      value={serviceData[3][index]}  // Mengakses deskripsi layanan
                      onChange={(e) => handleServiceUpdate(index, "description", e.target.value, 3)}
                    />
                  </td>
                  <td>
                    <img
                      src={serviceData[4][index]}
                      alt="Layanan"
                      className="preview-hero"
                    />
                    <input
                      type="file"
                      onChange={(e) => handleServiceUpdate(index, "image", e, 4)}
                    />
                  </td>
                  <td>
                    <button onClick={handleServiceData}>Save</button>
                  </td>
                </tr>
              ))
          ) : (
            <p>Loading...</p>
          )}
        </tbody>
      </table>

            

            <h3>Edit Gallery</h3>
            <table>
              <tbody>
                  <tr>
                    <td>
                      <img src={galleryData['img6']} className="gallery-preview" />
                      <input type="file" onChange={(e) => handleImgGallery(e, 'img6')} />
                    </td>
                    <td>
                      <img src={galleryData['img3']} className="gallery-preview" />
                      <input type="file" onChange={(e) => handleImgGallery(e, `galleryImages[${webData[1]['img6']}]`)} />
                    </td>
                    <td>
                      <img src={galleryData['img5']} className="gallery-preview" />
                      <input type="file" onChange={(e) => handleImgGallery(e, `galleryImages[${webData[1]['img6']}]`)} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src={galleryData['img1']} className="gallery-preview" />
                      <input type="file" onChange={(e) => handleImgGallery(e, `galleryImages[${webData[1]['img6']}]`)} />
                    </td>
                    <td>
                      <img src={galleryData['img2']} className="gallery-preview" />
                      <input type="file" onChange={(e) => handleImgGallery(e, `galleryImages[${webData[1]['img6']}]`)} />
                    </td>
                    <td>
                      <img src={galleryData['img4']} className="gallery-preview" />
                      <input type="file" onChange={(e) => handleImgGallery(e, `galleryImages[${webData[1]['img6']}]`)} />
                    </td>
                  </tr>
              </tbody>
            </table>
      <button onClick={saveGallery}>Upload All</button>

            <h3>Edit FAQ</h3>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>Num</th>
                  <th style={{ width: "35%" }}>Pertanyaan</th>
                  <th style={{ width: "50%" }}>Jawaban</th>
                  <th style={{ width: "10%" }}>Action</th>
                </tr>
              </thead>
              <tbody className='question_table'>
                {Object.entries(questionData)
                .filter(([key]) => key !== "id")
                .map(([key, faq], index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>
                      <textarea
                        type="text"
                        value={questionData[index+1]}
                        onChange={(e) => handleChangeFaq(key, e.target.value, 0)}
                      />
                    </td>
                    <td>
                      <textarea
                        value={answerData[index+1]}
                        onChange={(e) => handleChangeFaq(key, e.target.value, 1)}
                      />
                    </td>
                    <td>
                      <button>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="update-button" onClick={saveFAQ}>Update</button>
          </main>
        ) : (
        <p>Loading...</p>
      )}
      </section>
    </div>
  );
};

export default Settings;
