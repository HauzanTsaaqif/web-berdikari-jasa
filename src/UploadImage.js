import axios from 'axios';

/**
 * Upload an image to Cloudinary with auto-generated public ID
 * @param {File} imageFile - The image file to be uploaded
 * @returns {Promise<string>} - Returns a promise with the secure URL of the uploaded image
 */
export const uploadImage = async (imageFile) => {
  const cloudName = 'dmzhwldug'; // Ganti dengan Cloud Name Anda
  const uploadPreset = 'berdikari'; // Ganti dengan Upload Preset Anda
  
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    // Mengembalikan secure_url (alamat file yang diunggah)
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};
