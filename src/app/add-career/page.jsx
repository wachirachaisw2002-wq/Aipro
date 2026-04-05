"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AddCareerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [faculties, setFaculties] = useState("");
    const [skills, setSkills] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().role === "admin") {
                    setCheckingAuth(false);
                } else {
                    alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้!");
                    router.push("/");
                }
            } else {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const facultiesArray = faculties.split(",").map(item => item.trim()).filter(item => item !== "");
            const skillsArray = skills.split(",").map(item => item.trim()).filter(item => item !== "");

            // บันทึกข้อมูลพร้อมลิงก์รูปลง Firestore
            await addDoc(collection(db, "careers"), {
                name,
                description,
                faculties: facultiesArray,
                skills: skillsArray,
                imageUrl,
                createdAt: new Date()
            });

            alert("✅ เพิ่มข้อมูลอาชีพสำเร็จ!");
            router.push("/");
        } catch (error) {
            console.error("เกิดข้อผิดพลาด: ", error);
            alert("ไม่สามารถเพิ่มข้อมูลได้");
        } finally {
            setLoading(false);
        }
    };

    // หน้า Loading ระหว่างเช็คสิทธิ์แอดมิน
    if (checkingAuth) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-50">
                <div className="animate-spin text-4xl">⏳</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 md:px-8 font-sans">

            {/* ส่วนหัวของหน้า */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    เพิ่มข้อมูล<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">อาชีพใหม่</span>
                </h1>
                <p className="text-slate-500 mt-3 text-lg">
                    สร้างฐานข้อมูลอาชีพ เพื่อเป็นแนวทางให้กับผู้ใช้งาน
                </p>
            </div>

            <Card className="w-full max-w-2xl shadow-xl border-slate-100 rounded-2xl bg-white overflow-hidden relative">

                {/* แถบสีตกแต่งด้านบน */}
                <div className="h-2 w-full bg-gradient-to-r from-teal-400 to-blue-500 absolute top-0 left-0" />

                <CardHeader className="pt-8 pb-4 border-b border-slate-50 px-8">
                    <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
                        📝 ฟอร์มรายละเอียดอาชีพ
                    </CardTitle>
                    <CardDescription className="text-base text-slate-500">
                        กรุณากรอกข้อมูลให้ครบถ้วน เพื่อการแสดงผลที่สมบูรณ์
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pt-6 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium text-base">💼 ชื่ออาชีพ</Label>
                            <Input
                                required
                                placeholder="เช่น Software Engineer, Data Analyst"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="rounded-xl border-slate-300 py-6 px-4 bg-slate-50 focus:bg-white focus-visible:ring-teal-500 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium text-base">📄 รายละเอียดอาชีพ</Label>
                            <Textarea
                                required
                                placeholder="อธิบายลักษณะการทำงานสั้นๆ หน้าที่หลัก..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="rounded-xl border-slate-300 p-4 bg-slate-50 focus:bg-white focus-visible:ring-teal-500 text-base resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium text-base">🎓 คณะที่แนะนำ <span className="text-sm text-slate-400 font-normal">(คั่นด้วยเครื่องหมายลูกน้ำ ,)</span></Label>
                            <Input
                                required
                                placeholder="เช่น วิศวกรรมคอมพิวเตอร์, วิทยาการคอมพิวเตอร์"
                                value={faculties}
                                onChange={(e) => setFaculties(e.target.value)}
                                className="rounded-xl border-slate-300 py-6 px-4 bg-slate-50 focus:bg-white focus-visible:ring-teal-500 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium text-base">💻 สกิลที่ควรมี <span className="text-sm text-slate-400 font-normal">(คั่นด้วยเครื่องหมายลูกน้ำ ,)</span></Label>
                            <Input
                                required
                                placeholder="เช่น JavaScript, React, การคิดวิเคราะห์"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="rounded-xl border-slate-300 py-6 px-4 bg-slate-50 focus:bg-white focus-visible:ring-teal-500 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium text-base">🖼️ ลิงก์รูปภาพ (Image URL) <span className="text-sm text-slate-400 font-normal">(คัดลอกที่อยู่รูปภาพมาวาง)</span></Label>
                            <Input
                                placeholder="เช่น https://images.unsplash.com/..."
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="rounded-xl border-slate-300 py-6 px-4 bg-slate-50 focus:bg-white focus-visible:ring-teal-500 text-base"
                            />
                        </div>

                        {/* กลุ่มปุ่มกด */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 rounded-xl py-6 text-base border-slate-300 text-slate-600 hover:bg-slate-100"
                                onClick={() => router.push("/")}
                            >
                                ยกเลิก
                            </Button>

                            <Button
                                type="submit"
                                className="flex-1 rounded-xl py-6 text-base bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all"
                                disabled={loading}
                            >
                                {loading ? "กำลังบันทึกข้อมูล..." : "💾 บันทึกข้อมูลอาชีพ"}
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}