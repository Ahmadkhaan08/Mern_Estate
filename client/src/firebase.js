// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_API_KEY,
  authDomain: "khan-s-estate.firebaseapp.com",
  projectId: "khan-s-estate",
  storageBucket: "khan-s-estate.appspot.com",
  messagingSenderId: "27629002375",
  appId: "1:27629002375:web:36118559fb4d04759fa222"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);