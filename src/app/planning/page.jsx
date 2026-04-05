"use client";

import { useEffect, useState, Suspense } from "react"; // 👈 1. เพิ่ม Suspense เข้ามาตรงนี้
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { auth, db } from "@/firebase";

import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

// 👇 2. เปลี่ยนชื่อจาก export default function PlanningPage เป็นแค่ฟังก์ชันธรรมดา
function PlanningContent() {
  const params = useSearchParams();
  const field = params.get("field");

  const [career, setCareer] = useState(field || "");
  const [roadmap, setRoadmap] = useState("");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [expandedPlanId, setExpandedPlanId] = useState(null);

  /* -------------------------
     Generate AI Plan
  -------------------------- */
  const generatePlan = async () => {
    if (!career) {
      alert("กรุณาระบุชื่ออาชีพที่ต้องการวางแผน");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/career-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field: career }),
      });

      const data = await res.json();
      setRoadmap(data.result || data.roadmap);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ AI");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     Save Plan
  -------------------------- */
  const savePlan = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนบันทึกแผนครับ");
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "plans"), {
        career: career,
        roadmap: roadmap,
        createdAt: serverTimestamp(),
      });

      alert("💾 บันทึกแผนเรียบร้อยแล้ว!");
      loadPlans();
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถบันทึกได้ โปรดลองอีกครั้ง");
    }
  };

  /* -------------------------
     Load Plans
  -------------------------- */
  const loadPlans = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const snapshot = await getDocs(
        collection(db, "users", user.uid, "plans")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // เรียงจากแผนล่าสุดขึ้นก่อน (ถ้ามี field createdAt)
      data.sort((a, b) => b.createdAt - a.createdAt);
      setPlans(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* -------------------------
     Delete Plan
  -------------------------- */
  const deletePlan = async (planId) => {
    const user = auth.currentUser;
    if (!user) return;

    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแผนนี้?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "plans", planId));
      loadPlans();
    } catch (error) {
      console.error(error);
    }
  };

  /* -------------------------
     Expand / Collapse
  -------------------------- */
  const toggleExpand = (id) => {
    if (expandedPlanId === id) {
      setExpandedPlanId(null);
    } else {
      setExpandedPlanId(id);
    }
  };

  /* -------------------------
     Preview Text
  -------------------------- */
  const getPreview = (text) => {
    if (!text) return "";
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  };

  /* -------------------------
     Load Plans On Start
  -------------------------- */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadPlans();
      } else {
        setPlans([]); // ล้างข้อมูลถ้าไม่ได้ล็อกอิน
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 flex flex-col items-center font-sans">
      
      {/* Header Section */}
      <div className="text-center mb-10 w-full max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
          🎯 แผนเส้นทาง<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">อาชีพของคุณ</span>
        </h1>
        <p className="text-slate-500 text-lg">
          ให้ AI ช่วยวาง Roadmap พัฒนาทักษะและก้าวสู่อาชีพในฝันอย่างเป็นขั้นตอน
        </p>
      </div>

      {/* Input Career */}
      <Card className="w-full max-w-3xl mb-12 shadow-sm border-slate-200 rounded-2xl p-2 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="พิมพ์ชื่ออาชีพ... เช่น Data Scientist, UX Designer"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            className="text-base sm:text-lg py-6 px-4 rounded-xl border-slate-200 bg-white"
          />
          <Button 
            onClick={generatePlan}
            disabled={loading}
            className="py-6 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-base sm:text-lg shadow-md transition-all whitespace-nowrap"
          >
            {loading ? "กำลังคิด..." : "🚀 สร้าง Roadmap"}
          </Button>
        </div>
      </Card>

      {/* AI Result Card */}
      {(loading || roadmap) && (
        <Card className="max-w-3xl w-full mb-16 shadow-xl border-teal-100 rounded-2xl relative overflow-hidden bg-white">
          <div className="h-2 w-full bg-gradient-to-r from-teal-400 to-blue-500 absolute top-0 left-0" />
          
          <CardHeader className="pt-8 pb-4">
            <CardTitle className="text-2xl flex items-center gap-3 text-slate-800">
              {loading ? (
                <span className="animate-spin text-teal-500">⏳</span>
              ) : (
                <span className="text-3xl">🤖</span>
              )}
              {loading ? "AI กำลังวางแผนให้คุณ..." : "AI Career Roadmap"}
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 sm:px-10 pb-10">
            <div className={`bg-slate-50 p-6 sm:p-8 rounded-xl text-slate-700 leading-relaxed text-base sm:text-lg border border-slate-100 shadow-inner whitespace-pre-wrap ${loading ? 'animate-pulse' : ''}`}>
              {loading ? "กำลังประมวลผลข้อมูล ทักษะ และระยะเวลาที่เหมาะสม..." : roadmap}
            </div>

            {!loading && roadmap && (
              <div className="mt-8 flex justify-end">
                <Button
                  onClick={savePlan}
                  className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-8 py-6 text-base shadow-sm hover:shadow-md transition-all"
                >
                  💾 บันทึกแผนนี้เก็บไว้
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Saved Plans */}
      <div className="max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
          📚 แผนที่เคยบันทึกไว้
        </h2>

        <div className="space-y-4">
          {plans.length === 0 && (
            <div className="text-center p-10 bg-white border border-slate-200 rounded-2xl border-dashed">
              <p className="text-slate-400 text-lg">ยังไม่มีแผนที่บันทึกไว้ในระบบ</p>
            </div>
          )}

          {plans.map((plan) => {
            const isExpanded = expandedPlanId === plan.id;

            return (
              <Card key={plan.id} className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
                <CardHeader className="bg-white pb-4 pt-5 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50">
                  <CardTitle className="text-xl text-teal-700 font-bold">
                    {plan.career}
                  </CardTitle>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none border-teal-200 text-teal-700 hover:bg-teal-50 rounded-full"
                      onClick={() => toggleExpand(plan.id)}
                    >
                      {isExpanded ? "ย่อเก็บ" : "👁️ ดูแผน"}
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 sm:flex-none text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                      onClick={() => deletePlan(plan.id)}
                    >
                      🗑️ ลบ
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-6 pt-4">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {isExpanded ? plan.roadmap : getPreview(plan.roadmap)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-16 w-full max-w-xl">
        <Button
          variant="outline"
          className="flex-1 rounded-full py-6 text-base border-slate-300 text-slate-600 hover:bg-slate-100"
          onClick={() => window.location.href = "/assessment"}
        >
          ⬅ ทำแบบประเมินใหม่
        </Button>
        <Button
          className="flex-1 rounded-full py-6 text-base bg-slate-800 hover:bg-slate-900 text-white"
          onClick={() => window.location.href = "/"}
        >
          🏠 กลับหน้าหลัก
        </Button>
      </div>

    </div>
  );
}

// 👇 3. สร้างฟังก์ชันตัวหลักอันใหม่ ที่เอา Suspense มาครอบ Content ไว้ข้างใน
export default function PlanningPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        กำลังโหลดข้อมูล...
      </div>
    }>
      <PlanningContent />
    </Suspense>
  );
}