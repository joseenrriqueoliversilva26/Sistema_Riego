import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, orderBy, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Plant } from "@/components/homeScreen/plant";

const firebaseConfig = {
  apiKey: "AIzaSyA2RhSmRR802iWj8SrL5O6BcWlBxTZMbAk",
  authDomain: "sistema-de-riego-intelig-28f3f.firebaseapp.com",
  projectId: "sistema-de-riego-intelig-28f3f",
  storageBucket: "sistema-de-riego-intelig-28f3f.firebasestorage.app",
  messagingSenderId: "386916300017",
  appId: "1:386916300017:web:fffa06e422db06d4042550",
  measurementId: "G-3FW4V3057F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);