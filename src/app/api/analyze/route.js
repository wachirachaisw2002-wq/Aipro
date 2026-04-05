import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { field, qaData } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    let prompt = `คุณคือผู้เชี่ยวชาญด้านการแนะแนวอาชีพ
ผู้ใช้สนใจสายงาน: ${field}
ข้อมูลจากการตอบแบบสอบถาม:\n`;

    qaData.forEach((qa, index) => {
      prompt += `${index + 1}. ${qa.question} -> ตอบ: ${qa.answer}\n`;
    });

    prompt += `\nกรุณาวิเคราะห์จุดแข็งและแนะนำอาชีพที่เหมาะที่สุด พร้อมบอกเหตุผลและสกิลที่ควรเรียนรู้ (ตอบเป็นภาษาไทยแบบเป็นมิตร)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "AI Error" }, { status: 500 });
  }
}