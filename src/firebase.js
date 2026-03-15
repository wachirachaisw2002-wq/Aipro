import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // เพิ่มการ Import ตัวนี้

const firebaseConfig = {
  apiKey: "AIzaSyCl6cAGje1ylRDzHTf9BuHHPL-bmuErCUK",
  authDomain: "career-path-db.firebaseapp.com",
  projectId: "career-path-db",
  storageBucket: "career-path-db.firebasestorage.app",
  messagingSenderId: "443079461430",
  appId: "1:443079461430:web:f68e081ca8f3fe113da697",
  measurementId: "G-L8V65WCXQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ส่งออก db ไปให้ไฟล์อื่นใช้งาน
export const db = getFirestore(app);