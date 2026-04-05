"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

/* ---------------------------
   10 Career Fields
---------------------------- */
const careerFields = [
    { id: "tech", name: "💻 เทคโนโลยี", desc: "Software Developer, Data Scientist, AI Engineer" },
    { id: "business", name: "📊 ธุรกิจ", desc: "Marketing, Business Analyst, Project Manager" },
    { id: "art", name: "🎨 ศิลปะและดีไซน์", desc: "Graphic Designer, UX/UI Designer" },
    { id: "health", name: "🩺 สุขภาพ", desc: "แพทย์ พยาบาล นักกายภาพ" },
    { id: "education", name: "📚 การศึกษา", desc: "ครู อาจารย์ นักพัฒนาหลักสูตร" },
    { id: "engineering", name: "⚙️ วิศวกรรม", desc: "โยธา ไฟฟ้า เครื่องกล" },
    { id: "law", name: "⚖️ กฎหมาย", desc: "ทนาย อัยการ ที่ปรึกษากฎหมาย" },
    { id: "science", name: "🔬 วิทยาศาสตร์", desc: "นักวิจัย นักวิทยาศาสตร์" },
    { id: "media", name: "🎤 สื่อสารมวลชน", desc: "นักข่าว PR Content Creator" },
    { id: "tourism", name: "✈️ บริการและท่องเที่ยว", desc: "โรงแรม การบิน ไกด์" },
];

/* ---------------------------
   10 Questions per Field
---------------------------- */
const baseQuestions = [
    "คุณชอบเรียนรู้สิ่งใหม่ ๆ อยู่เสมอหรือไม่?",
    "คุณสามารถทำงานที่ต้องใช้สมาธิเป็นเวลานานได้หรือไม่?",
    "คุณชอบการวิเคราะห์และแก้ปัญหาที่ซับซ้อนหรือไม่?",
    "คุณสนุกกับการทำงานร่วมกับผู้อื่นหรือไม่?",
    "คุณสามารถรับมือกับความกดดันในการทำงานได้ดีหรือไม่?",
    "คุณมีความรับผิดชอบต่อหน้าที่ของตนเองหรือไม่?",
    "คุณชอบวางแผนและจัดระเบียบงานหรือไม่?",
    "คุณเปิดรับความคิดเห็นหรือคำแนะนำจากผู้อื่นหรือไม่?",
    "คุณสามารถตัดสินใจได้ดีในสถานการณ์สำคัญหรือไม่?",
    "คุณมีความตั้งใจพัฒนาทักษะของตัวเองอย่างต่อเนื่องหรือไม่?",
];

const questionSets = {};
careerFields.forEach((field) => {
    questionSets[field.id] = baseQuestions.map((q, i) => ({
        id: i + 1,
        text: q,
    }));
});

/* ---------------------------
   Answer Options
---------------------------- */
const answerOptions = [
    { value: "1", label: "ไม่เลย" },
    { value: "2", label: "น้อย" },
    { value: "3", label: "ปานกลาง" },
    { value: "4", label: "มาก" },
    { value: "5", label: "มากที่สุด" },
];

/* =====================================================
   Component
===================================================== */
export default function AssessmentPage() {
    const [step, setStep] = useState(1);
    const [selectedField, setSelectedField] = useState(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [aiResult, setAiResult] = useState("");

    /* ---------------------------
       Select Career Field
    ---------------------------- */
    const handleSelectField = (fieldId) => {
        setSelectedField(fieldId);
        setStep(2);
        setCurrentQuestionIdx(0);
        setAnswers({});
    };

    /* ---------------------------
       Answer Question
    ---------------------------- */
    const handleAnswer = (value) => {
        const newAnswers = { ...answers, [currentQuestionIdx]: value };
        setAnswers(newAnswers);

        const totalQuestions = questionSets[selectedField].length;

        if (currentQuestionIdx < totalQuestions - 1) {
            setTimeout(() => {
                setCurrentQuestionIdx((prev) => prev + 1);
            }, 300);
        } else {
            submitToAI(newAnswers);
        }
    };

    /* ---------------------------
       Send Data to AI
    ---------------------------- */
    const submitToAI = async (finalAnswers) => {
        setStep(3);

        const questions = questionSets[selectedField];

        const qaData = questions.map((q, idx) => ({
            question: q.text,
            answer: answerOptions.find((opt) => opt.value === finalAnswers[idx])?.label || "ไม่ระบุ",
        }));

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    field: careerFields.find((f) => f.id === selectedField).name,
                    qaData,
                }),
            });

            const data = await res.json();
            setAiResult(res.ok ? data.result : "AI วิเคราะห์ไม่สำเร็จ");
        } catch {
            setAiResult("ไม่สามารถเชื่อมต่อ AI ได้");
        } finally {
            setStep(4);
        }
    };

    /* =====================================================
       STEP 1 : Career Selection UI
    ===================================================== */
    if (step === 1) {
        return (
            <div className="min-h-screen bg-slate-50 py-20 px-6 flex flex-col items-center font-sans">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
                        📋 เลือก<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">สายอาชีพ</span>ที่สนใจ
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        เลือกหมวดหมู่อาชีพเพื่อเริ่มทำแบบประเมินค้นหาความถนัดและสไตล์การทำงานของคุณ
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl w-full">
                    {careerFields.map((field) => (
                        <Card
                            key={field.id}
                            onClick={() => handleSelectField(field.id)}
                            className="cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-slate-100 hover:border-teal-300 bg-white/80 backdrop-blur-sm group rounded-2xl"
                        >
                            <CardHeader className="text-center flex flex-col items-center justify-center h-full p-6">
                                <CardTitle className="text-xl group-hover:text-teal-600 transition-colors mb-2">
                                    {field.name}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {field.desc}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    /* =====================================================
       STEP 2 : Question UI
    ===================================================== */
    if (step === 2) {
        const questions = questionSets[selectedField];
        const currentQ = questions[currentQuestionIdx];

        // ป้องกัน Error กรณีเปลี่ยน State ข้อสุดท้าย
        if (!currentQ) return <div className="min-h-screen flex justify-center items-center bg-slate-50"><div className="animate-spin text-4xl">⏳</div></div>;

        const progress = ((currentQuestionIdx) / questions.length) * 100;

        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans">
                <Card className="w-full max-w-3xl shadow-lg border-slate-100 bg-white rounded-2xl overflow-hidden flex flex-col">

                    {/* ส่วนแถบความคืบหน้า */}
                    <div className="bg-slate-50 p-6 border-b border-slate-100">
                        <div className="flex justify-between text-sm font-medium text-slate-500 mb-3">
                            <span>คำถามที่ {currentQuestionIdx + 1} จาก {questions.length}</span>
                            <span className="text-teal-600">{Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}%</span>
                        </div>
                        <Progress value={((currentQuestionIdx + 1) / questions.length) * 100} className="h-2.5 bg-slate-200" />
                    </div>

                    <CardHeader className="pt-8 pb-4 px-8 text-center">
                        <CardTitle className="text-2xl text-slate-800 leading-relaxed font-semibold">
                            {currentQ.text}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="px-8 pb-8">
                        <RadioGroup
                            value={answers[currentQuestionIdx] || ""}
                            onValueChange={handleAnswer}
                            className="space-y-4 mt-4"
                        >
                            {answerOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className="flex items-center space-x-4 border border-slate-200 p-5 rounded-xl hover:bg-teal-50 hover:border-teal-200 transition-colors cursor-pointer"
                                    onClick={() => handleAnswer(opt.value)}
                                >
                                    <RadioGroupItem
                                        value={opt.value}
                                        id={`opt-${opt.value}`}
                                        className="text-teal-600"
                                    />
                                    <Label
                                        htmlFor={`opt-${opt.value}`}
                                        className="cursor-pointer text-lg text-slate-700 flex-grow font-medium"
                                    >
                                        {opt.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>

                    {/* 👇 เพิ่ม CardFooter สำหรับปุ่มย้อนกลับตรงนี้ 👇 */}
                    <CardFooter className="bg-white border-t border-slate-50 px-8 py-4 mt-auto flex justify-start">
                        <Button
                            variant="ghost"
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors rounded-full px-6"
                            onClick={() => {
                                if (currentQuestionIdx > 0) {
                                    setCurrentQuestionIdx(prev => prev - 1); // ย้อนกลับ 1 ข้อ
                                } else {
                                    setStep(1); // ถ้าอยู่ข้อแรก ให้กลับไปหน้าเลือกสายงาน
                                }
                            }}
                        >
                            {currentQuestionIdx > 0 ? "⬅ ย้อนกลับไปข้อก่อนหน้า" : "⬅ เปลี่ยนสายอาชีพ"}
                        </Button>
                    </CardFooter>

                </Card>
            </div>
        );
    }

    /* =====================================================
       STEP 3 : AI Loading
    ===================================================== */
    if (step === 3) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 font-sans">
                <div className="relative flex justify-center items-center mb-8">
                    {/* วงแหวนกระจายตัวด้านหลัง */}
                    <div className="absolute w-32 h-32 bg-teal-200 rounded-full animate-ping opacity-50"></div>
                    <div className="relative text-7xl animate-bounce z-10">🤖</div>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
                    AI กำลังวิเคราะห์ตัวตนของคุณ...
                </h2>
                <p className="text-slate-500 animate-pulse text-lg">
                    กำลังประมวลผลทักษะและความถนัด
                </p>
            </div>
        );
    }

    /* =====================================================
       STEP 4 : Result
    ===================================================== */
    return (
        <div className="min-h-screen bg-slate-50 flex justify-center py-20 px-6 font-sans">
            <Card className="max-w-3xl w-full shadow-2xl border-slate-100 rounded-2xl overflow-hidden relative h-fit">

                {/* แถบสีด้านบน */}
                <div className="h-2 w-full bg-gradient-to-r from-teal-400 to-blue-500 absolute top-0 left-0" />

                <CardHeader className="pt-10 pb-6">
                    <div className="text-6xl text-center mb-4">✨</div>
                    <CardTitle className="text-center text-3xl font-bold text-slate-800">
                        ผลวิเคราะห์จาก CareerPath AI
                    </CardTitle>
                    <CardDescription className="text-center text-lg mt-2">
                        สรุปจุดแข็งและคำแนะนำอาชีพที่เหมาะกับคุณ
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 md:px-12 pb-8">
                    {/* กล่องข้อความผลลัพธ์ */}
                    <div className="bg-slate-50 p-6 md:p-8 rounded-xl text-slate-700 leading-relaxed text-lg border border-slate-100 shadow-inner whitespace-pre-wrap">
                        {aiResult}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pb-10 px-8">
                    <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-full sm:w-auto rounded-full px-8 py-6 text-base border-slate-300 text-slate-600 hover:bg-slate-100"
                    >
                        ทำแบบประเมินใหม่
                    </Button>

                    <Button
                        className="w-full sm:w-auto rounded-full px-8 py-6 text-base bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all"
                        onClick={() =>
                            (window.location.href = `/planning?field=${selectedField}`)
                        }
                    >
                        ไปวางแผนเส้นทางอาชีพ ➡
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}