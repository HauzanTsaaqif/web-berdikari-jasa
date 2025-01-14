// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5rTOgvmrxlA-f0c2fV0NWGC1O-7FCebc",
  authDomain: "berdikari-jasa.firebaseapp.com",
  projectId: "berdikari-jasa",
  storageBucket: "berdikari-jasa.firebasestorage.app",
  messagingSenderId: "129868125411",
  appId: "1:129868125411:web:38e80d970736886c2a61d6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };