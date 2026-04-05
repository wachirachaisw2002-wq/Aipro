"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // นำเข้าไอคอนรูปตา

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State สำหรับโชว์/ซ่อนรหัสผ่าน
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. สร้างบัญชีผู้ใช้ใหม่ใน Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. บันทึกข้อมูล Role ลงใน Firestore (ให้ค่าเริ่มต้นเป็น user)
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: "user", // "user" = คนทั่วไป, "admin" = แอดมิน
                createdAt: new Date()
            });

            alert("✅ สมัครสมาชิกสำเร็จ!");
            router.push("/"); // ส่งกลับไปหน้าแรก
        } catch (err) {
            setError("ไม่สามารถสมัครสมาชิกได้ โปรดตรวจสอบข้อมูลอีกครั้ง");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 font-sans">
            <Card className="w-full max-w-md shadow-2xl border-slate-100 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden relative">
                
                {/* แถบสีตกแต่งด้านบน */}
                <div className="h-2 w-full bg-gradient-to-r from-teal-400 to-blue-500 absolute top-0 left-0" />

                <CardHeader className="space-y-2 pt-10 pb-6 px-8">
                    <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                            <span className="text-2xl">🚀</span>
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-extrabold text-center text-slate-800 tracking-tight">
                        สมัครสมาชิกใหม่
                    </CardTitle>
                    <CardDescription className="text-center text-slate-500 text-base">
                        สร้างบัญชีเพื่อเริ่มต้นใช้งาน CareerPath AI 
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 px-8">
                    
                    {/* แจ้งเตือน Error */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                            <span>🚨</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">อีเมล</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="rounded-xl border-slate-300 py-6 px-4 bg-slate-50 focus:bg-white focus-visible:ring-teal-500 text-base transition-colors"
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <Label htmlFor="password" className="text-slate-700 font-medium">
                                รหัสผ่าน <span className="text-xs text-slate-400 font-normal">(ขั้นต่ำ 6 ตัวอักษร)</span>
                            </Label>
                            
                            <div className="relative flex items-center">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="6"
                                    className="rounded-xl border-slate-300 py-6 px-4 pr-12 bg-slate-50 focus:bg-white focus-visible:ring-teal-500 text-base transition-colors w-full"
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>

                        <Button 
                            className="w-full rounded-xl py-6 text-base font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all mt-4" 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2"><span className="animate-spin">⏳</span> กำลังสร้างบัญชี...</span>
                            ) : "สร้างบัญชีผู้ใช้"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="px-8 pb-8 pt-2">
                    <div className="text-base text-center text-slate-500 w-full pt-6 border-t border-slate-100">
                        มีบัญชีอยู่แล้ว?{" "}
                        <Link href="/login" className="text-teal-600 hover:text-teal-700 hover:underline font-semibold transition-colors">
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </CardFooter>
                
            </Card>
        </div>
    );
}