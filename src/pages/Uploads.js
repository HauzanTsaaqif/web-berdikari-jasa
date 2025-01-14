import React, { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

const Uploads = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); 
  const cld = new Cloudinary({ cloud: { cloudName: "dmzhwldug" } }); 

  const uploadToCloudinary = async (file) => {
    try {
      const uploadUrl = `https://api.cloudinary.com/v1_1/dmzhwldug/image/upload`;
  
      // Data form untuk dikirim ke API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "berdikari"); // Ganti dengan upload preset yang sudah kamu buat
  
      // Lakukan request ke Cloudinary
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Cloudinary Error: ${error.error.message}`);
      }
  
      const data = await response.json();
      // Pastikan hanya menggunakan data.secure_url yang diberikan oleh Cloudinary
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };
  

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Ambil file yang dipilih
    if (file) {
      try {
        // Upload gambar ke Cloudinary
        const imageUrl = await uploadToCloudinary(file);
        setUploadedImageUrl(imageUrl); // Simpan URL gambar yang diunggah
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  return (
    <div>
      <h1>Upload and Display Image</h1>

      {/* Input untuk mengunggah gambar */}
      <input type="file" onChange={handleFileChange} />

      {/* Tampilkan gambar yang diunggah */}
      {uploadedImageUrl && (
        <div>
            <h2>Uploaded Image:</h2>
            <p>{uploadedImageUrl}</p>
            <img src={uploadedImageUrl} alt="Uploaded" />
        </div>
        )}
    </div>
  );
};

export default Uploads;
