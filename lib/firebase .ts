// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2RhSmRR802iWj8SrL5O6BcWlBxTZMbAk",
  authDomain: "sistema-de-riego-intelig-28f3f.firebaseapp.com",
  projectId: "sistema-de-riego-intelig-28f3f",
  storageBucket: "sistema-de-riego-intelig-28f3f.firebasestorage.app",
  messagingSenderId: "386916300017",
  appId: "1:386916300017:web:fffa06e422db06d4042550",
  measurementId: "G-3FW4V3057F"
};

// Initialize Firebase
export const Firebase  = initializeApp(firebaseConfig);
const analytics = getAnalytics(Firebase );

export const auth = getAuth(Firebase);
