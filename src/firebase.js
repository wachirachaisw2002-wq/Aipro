// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 1. เพิ่มบรรทัดนี้
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCl6cAGje1ylRDzHTf9BuHHPL-bmuErCUk",
    authDomain: "career-path-db.firebaseapp.com",
    projectId: "career-path-db",
    storageBucket: "career-path-db.firebasestorage.app",
    messagingSenderId: "443079461430",
    appId: "1:443079461430:web:f68e081ca8f3fe113da697",
    measurementId: "G-L8V65WCXQT"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); // 2. เพิ่มบรรทัดนี้เพื่อส่งออก auth ไปใช้
export const storage = getStorage(app);