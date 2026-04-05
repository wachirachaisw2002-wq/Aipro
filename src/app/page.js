"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

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
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          <div className="text-xl text-teal-700 font-medium animate-pulse">กำลังโหลดข้อมูลอาชีพ...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12 bg-slate-50 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* ส่วน Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-800 tracking-tight">
            ค้นหา<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">เส้นทางอาชีพ</span>ของคุณ
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            สำรวจสายงานที่ใช่ ค้นพบคณะที่ชอบ และเตรียมพร้อมทักษะที่จำเป็นสำหรับอนาคตของคุณ
          </p>
        </div>

        {/* ส่วนปุ่มของ Admin */}
        {isAdmin && (
          <div className="flex justify-end mb-8">
            <Link href="/add-career">
              <Button className="bg-slate-900 hover:bg-teal-600 text-white shadow-md hover:shadow-lg transition-all rounded-full px-6">
                <span className="mr-2 text-lg">➕</span> เพิ่มข้อมูลอาชีพ
              </Button>
            </Link>
          </div>
        )}

        {/* ส่วนแสดงการ์ดอาชีพ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careers.map((career) => (
            <Card key={career.id} className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-slate-100 bg-white/90 backdrop-blur-sm relative overflow-hidden group flex flex-col rounded-2xl">

              {/* รูปภาพ */}
              <div className="w-full h-52 relative overflow-hidden shrink-0 bg-slate-100">
                <Image
                  src={career.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
                  alt={career.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* แถบเงาไล่สีด้านล่างรูปภาพ (Gradient Overlay) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* ชื่อและรายละเอียด */}
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                  {career.name}
                </CardTitle>
                <CardDescription className="text-slate-600 text-sm leading-relaxed mt-2 line-clamp-3">
                  {career.description}
                </CardDescription>
              </CardHeader>

              {/* คณะและสกิล */}
              <CardContent className="space-y-4 flex-grow pt-4">

                {/* กล่องคณะ */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50">
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    🎓 คณะที่แนะนำ
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {career.faculties?.map((faculty, index) => (
                      <Badge key={index} variant="secondary" className="bg-white border border-blue-100 text-blue-700 hover:bg-blue-100 font-medium text-xs px-3 py-1.5 rounded-full shadow-sm">
                        {faculty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* กล่องสกิล */}
                <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100/50">
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    💻 สกิลที่ควรมี
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {career.skills?.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-white border-teal-200 text-teal-700 hover:bg-teal-50 font-medium text-xs px-3 py-1.5 rounded-full shadow-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

              </CardContent>

              {/* ปุ่มแก้ไข (Admin) */}
              {isAdmin && (
                <div className="p-4 pt-0 mt-auto bg-white border-t border-slate-50 z-10">
                  <Link href={`/edit-career/${career.id}`}>
                    <Button variant="ghost" className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors font-medium">
                      ✏️ แก้ไขข้อมูลอาชีพ
                    </Button>
                  </Link>
                </div>
              )}

            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}