"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // ดึงการตั้งค่าฐานข้อมูลที่เราทำไว้

export default function Home() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ฟังก์ชันไปดึงข้อมูลจาก Firestore
    const fetchCareers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "careers"));
        const careersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCareers(careersData);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  // หน้าจอตอนกำลังโหลดข้อมูล
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600 font-semibold">กำลังโหลดข้อมูลอาชีพ...</p>
      </div>
    );
  }

  // หน้าจอแสดงผลหลัก
  return (
    <main className="min-h-screen p-8 bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">
          🎯 ค้นหาเส้นทางอาชีพของคุณ
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careers.map((career) => (
            <div key={career.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">{career.name}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{career.description}</p>

              <div className="mb-4">
                <h3 className="font-semibold text-indigo-600 mb-2">🎓 คณะที่แนะนำ</h3>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  {career.faculties?.map((faculty, index) => (
                    <li key={index}>{faculty}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-indigo-600 mb-2">💻 สกิลที่ควรมี</h3>
                <div className="flex flex-wrap gap-2">
                  {career.skills?.map((skill, index) => (
                    <span key={index} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}