"use client";

import { useState } from "react";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err) {
            if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดตรวจสอบอีกครั้ง");
            } else {
                setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ โปรดลองใหม่ภายหลัง");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    role: "user",
                    createdAt: new Date()
                });
            }

            router.push("/");
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("กรุณากรอก 'อีเมล' ของคุณในช่องด้านบนก่อนคลิกปุ่มลืมรหัสผ่าน");
            return;
        }

        try {
            setError("");
            setMessage("");
            await sendPasswordResetEmail(auth, email);
            setMessage("ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปที่อีเมลของคุณแล้ว กรุณาตรวจสอบกล่องจดหมาย");
        } catch (err) {
            setError("ไม่พบอีเมลนี้ในระบบ หรือเกิดข้อผิดพลาด");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 font-sans">
            <Card className="w-full max-w-md shadow-2xl border-slate-100 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden relative">

                {/* แถบสีตกแต่งด้านบน */}
                <div className="h-2 w-full bg-gradient-to-r from-teal-400 to-blue-500 absolute top-0 left-0" />

                <CardHeader className="space-y-2 pt-10 pb-6 px-8">
                    <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center border border-teal-100">
                            <span className="text-2xl">✨</span>
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-extrabold text-center text-slate-800 tracking-tight">
                        ยินดีต้อนรับกลับมา
                    </CardTitle>
                    <CardDescription className="text-center text-slate-500 text-base">
                        เข้าสู่ระบบเพื่อใช้งาน CareerPath AI
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 px-8">

                    {/* แจ้งเตือน Error */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                            <span>🚨</span> {error}
                        </div>
                    )}

                    {/* แจ้งเตือน ข้อความสำเร็จ */}
                    {message && (
                        <div className="p-4 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl text-sm font-medium flex items-center gap-2">
                            <span>✅</span> {message}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-700 font-medium">รหัสผ่าน</Label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-sm text-teal-600 hover:text-teal-700 hover:underline transition-colors font-medium"
                                >
                                    ลืมรหัสผ่าน?
                                </button>
                            </div>

                            <div className="relative flex items-center">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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
                            className="w-full rounded-xl py-6 text-base font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all mt-2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2"><span className="animate-spin">⏳</span> กำลังเข้าสู่ระบบ...</span>
                            ) : "เข้าสู่ระบบ"}
                        </Button>
                    </form>

                    {/* เส้นแบ่ง "หรือ" */}
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium bg-white px-2">หรือ</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* ปุ่มเข้าสู่ระบบด้วย Google */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl py-6 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center gap-3 text-base font-medium"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.654-3.343-11.303-8l-6.572 4.82C9.656 39.663 16.318 44 24 44z" />
                            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                        </svg>
                        เข้าสู่ระบบด้วย Google
                    </Button>
                </CardContent>

                <CardFooter className="px-8 pb-8 pt-2">
                    <div className="text-base text-center text-slate-500 w-full pt-6 border-t border-slate-100">
                        ยังไม่มีบัญชี CareerPath AI?{" "}
                        <Link href="/register" className="text-teal-600 hover:text-teal-700 hover:underline font-semibold transition-colors">
                            สมัครสมาชิกใหม่
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}