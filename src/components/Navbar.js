"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* โลโก้ */}
                <Link href="/" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500 tracking-tight hover:opacity-80 transition">
                    ✨ CareerPath 
                </Link>

                {/* เมนูตรงกลาง */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-medium text-slate-600">
                    <Link href="/" className="hover:text-teal-600 transition">หน้าแรก</Link>
                    <Link href="/assessment" className="hover:text-teal-600 transition">ประเมินอาชีพ</Link>
                    <Link href="/planning" className="hover:text-teal-600 transition">วางแผนเส้นทาง</Link>
                    <Link href="/chat" className="hover:text-teal-600 transition">Chatbot</Link>

                    <a
                        href="https://dekshowport.com/ตัวอย่าง-portfolio/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-500 hover:text-amber-600 transition"
                    >
                        Portfolio ↗
                    </a>
                </div>

                {/* ปุ่มด้านขวา (Login / Register / Logout) */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <Button onClick={handleLogout} variant="outline" className="rounded-full text-slate-600 border-slate-200 hover:bg-slate-100 transition-all">
                            ออกจากระบบ
                        </Button>
                    ) : (
                        <>
                            {/* ปุ่มเข้าสู่ระบบ (แบบโปร่ง) */}
                            <Link href="/login">
                                <Button variant="ghost" className="rounded-full text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-all">
                                    เข้าสู่ระบบ
                                </Button>
                            </Link>

                            {/* ปุ่มสมัครสมาชิก (แบบไล่สีเด่นๆ) */}
                            <Link href="/register">
                                <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-full px-6 shadow-sm hover:shadow-md transition-all">
                                    สมัครสมาชิก
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}