// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mern-estate-fe77e.firebaseapp.com",
  projectId: "mern-estate-fe77e",
  storageBucket: "mern-estate-fe77e.firebasestorage.app",
  messagingSenderId: "272220859535",
  appId: "1:272220859535:web:b0a5955a2480e6c50ad4fa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);