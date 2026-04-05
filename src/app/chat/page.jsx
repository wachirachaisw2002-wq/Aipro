"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // ตัวแปรอ้างอิงสำหรับใช้เลื่อนหน้าจอลงล่างสุดอัตโนมัติ
    const messagesEndRef = useRef(null);

    // ฟังก์ชันเลื่อนหน้าจออัตโนมัติ
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // สั่งให้เลื่อนลงทุกครั้งที่ messages หรือ isLoading มีการเปลี่ยนแปลง
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput(""); // เคลียร์ช่องพิมพ์ทันที
        setIsLoading(true); // เปิดสถานะกำลังโหลด

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();

            // เผื่อในกรณี API ส่งกลับมาเป็น data.result หรือ data.reply
            const botMsg = { role: "assistant", content: data.reply || data.result || "ขออภัย เกิดข้อผิดพลาดในการตอบกลับ" };
            setMessages((prev) => [...prev, botMsg]);

        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: "assistant", content: "🚨 ไม่สามารถเชื่อมต่อกับ AI ได้ กรุณาลองใหม่อีกครั้ง" }]);
        } finally {
            setIsLoading(false); // ปิดสถานะกำลังโหลด
        }
    };

    // ฟังก์ชันสำหรับกดปุ่ม Enter แล้วส่งข้อความได้เลย
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 md:px-8 font-sans">

            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    💬 ผู้ช่วย <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">AI Chatbot</span>
                </h1>
                <p className="text-slate-500 mt-2">
                    สอบถามข้อมูลอาชีพ ข้อสงสัย หรือขอคำแนะนำเพิ่มเติมได้เลย
                </p>
            </div>

            <Card className="w-full max-w-3xl shadow-xl border-slate-200 rounded-2xl overflow-hidden bg-white flex flex-col h-[70vh] md:h-[600px]">

                {/* แถบสีด้านบน */}
                <div className="h-2 w-full bg-gradient-to-r from-teal-400 to-blue-500" />

                <CardHeader className="border-b border-slate-100 pb-4 pt-6 px-6 shadow-sm z-10 bg-white">
                    <CardTitle className="flex items-center gap-3 text-slate-800 text-xl">
                        <span className="text-2xl bg-slate-100 p-2 rounded-full">🤖</span>
                        CareerPath Assistant
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col p-0 overflow-hidden bg-slate-50/50">

                    {/* พื้นที่แสดงข้อความแชท */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-6">

                        {/* ข้อความต้อนรับเริ่มต้น (ถ้ายังไม่มีการคุย) */}
                        {messages.length === 0 && (
                            <div className="text-center text-slate-400 mt-10">
                                <p className="text-5xl mb-4">👋</p>
                                <p>สวัสดีครับ! มีอะไรให้ผมช่วยแนะนำเกี่ยวกับสายอาชีพไหมครับ?</p>
                            </div>
                        )}

                        {/* ลูปแสดงข้อความ */}
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                            >
                                <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

                                    {/* ไอคอนโปรไฟล์ */}
                                    <div className="text-2xl mb-1">
                                        {msg.role === "user" ? "👤" : "🤖"}
                                    </div>

                                    {/* กล่องข้อความ */}
                                    <div
                                        className={`p-4 shadow-sm text-base md:text-lg whitespace-pre-wrap leading-relaxed ${msg.role === "user"
                                                ? "bg-teal-600 text-white rounded-2xl rounded-br-sm"
                                                : "bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* สถานะ AI กำลังพิมพ์ (โชว์เฉพาะตอน isLoading เป็น true) */}
                        {isLoading && (
                            <div className="flex flex-col items-start">
                                <div className="flex items-end gap-2 max-w-[85%]">
                                    <div className="text-2xl mb-1">🤖</div>
                                    <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center h-[56px]">
                                        <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                        <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ตัวอ้างอิงเพื่อเลื่อนจอลงล่างสุด */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* พื้นที่พิมพ์ข้อความ */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <div className="flex gap-3">
                            <Input
                                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown} // กด Enter เพื่อส่ง
                                disabled={isLoading}
                                className="flex-grow py-6 px-4 rounded-xl border-slate-300 text-base focus-visible:ring-teal-500"
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={isLoading || !input.trim()}
                                className="px-8 py-6 rounded-xl bg-slate-800 hover:bg-teal-600 text-white transition-colors"
                            >
                                <span className="mr-2 text-lg">🚀</span> ส่ง
                            </Button>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}