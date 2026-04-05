"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../firebase";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditCareerPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

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
                    fetchCareerData();
                } else {
                    alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้!");
                    router.push("/");
                }
            } else {
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [router, id]);

    const fetchCareerData = async () => {
        try {
            const docRef = doc(db, "careers", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.name || "");
                setDescription(data.description || "");
                setImageUrl(data.imageUrl || "");
                setFaculties(data.faculties ? data.faculties.join(", ") : "");
                setSkills(data.skills ? data.skills.join(", ") : "");
            } else {
                alert("ไม่พบข้อมูลอาชีพนี้ในระบบ");
                router.push("/");
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const facultiesArray = faculties.split(",").map(item => item.trim()).filter(item => item !== "");
            const skillsArray = skills.split(",").map(item => item.trim()).filter(item => item !== "");

            const docRef = doc(db, "careers", id);
            await updateDoc(docRef, {
                name,
                description,
                faculties: facultiesArray,
                skills: skillsArray,
                imageUrl
            });

            alert("✅ อัปเดตข้อมูลอาชีพสำเร็จ!");
            router.push("/");
        } catch (error) {
            console.error("เกิดข้อผิดพลาด: ", error);
            alert("ไม่สามารถอัปเดตข้อมูลได้");
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin text-4xl">⏳</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 md:px-8 font-sans">

            {/* Header Section */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    แก้ไขข้อมูล<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">อาชีพ</span>
                </h1>
                <p className="text-slate-500 mt-3 text-lg">
                    ปรับปรุงรายละเอียด คณะ สกิล หรือเปลี่ยนรูปภาพของอาชีพนี้
                </p>
            </div>

            <Card className="w-full max-w-2xl shadow-xl border-slate-100 rounded-2xl bg-white overflow-hidden relative">

                {/* แถบไล่สีด้านบน */}
                <div className="h-2 w-full bg-gradient-to-r from-amber-400 to-orange-500 absolute top-0 left-0" />

                <CardHeader className="pt-8 pb-4 border-b border-slate-50 px-8">
                    <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
                        ✏️ อัปเดตรายละเอียด
                    </CardTitle>
                    <CardDescription className="text-base text-slate-500">
                        แก้ไขข้อมูลที่ต้องการแล้วกดบันทึกเพื่ออัปเดตระบบ
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pt-6 pb-8">
                    <form onSubmit={handleUpdate} className="space-y-6">

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium text-base">💼 ชื่ออาชีพ</Label>
                            <Input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="rounded-xl border-slate-300 py-6 px-4 bg-slate-50 focus:bg-white focus-visible:ring-amber-500 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium text-base">📄 รายละเอียดอาชีพ</Label>
                            <Textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                className="rounded-xl border-slate-300 p-4 bg-slate-50 focus:bg-white focus-visible:ring-amber-500 text-base resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium text-base">🎓 คณะที่แนะนำ <span className="text-sm text-slate-400 font-normal">(คั่นด้วยเครื่องหมายลูกน้ำ ,)</span></Label>
                            <Input
                                required
                                value={faculties}
                                onChange={(e) => setFaculties(e.target.value)}
                                className="rounded-xl border-slate-300 py-6 px-4 bg-slate-50 focus:bg-white focus-visible:ring-amber-500 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium text-base">💻 สกิลที่ควรมี <span className="text-sm text-slate-400 font-normal">(คั่นด้วยเครื่องหมายลูกน้ำ ,)</span></Label>
                            <Input
                                required
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="rounded-xl border-slate-300 py-6 px-4 bg-slate-50 focus:bg-white focus-visible:ring-amber-500 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium text-base">🖼️ ลิงก์รูปภาพ (Image URL)</Label>
                            <Input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://..."
                                className="rounded-xl border-slate-300 py-6 px-4 bg-slate-50 focus:bg-white focus-visible:ring-amber-500 text-base"
                            />
                        </div>

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
                                className="flex-1 rounded-xl py-6 text-base bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all"
                                disabled={loading}
                            >
                                {loading ? "กำลังบันทึก..." : "💾 บันทึกการแก้ไข"}
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}