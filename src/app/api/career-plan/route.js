import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {

    const body = await req.json();
    const { field } = body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
    });

    const prompt = `
คุณคือ Career Advisor

สร้าง Career Roadmap สำหรับสายอาชีพนี้

สายอาชีพ: ${field}

ตอบเป็นหัวข้อดังนี้

1. ทักษะสำคัญ
2. สิ่งที่ควรเรียน
3. Portfolio ที่ควรทำ
4. งานแรกที่ควรสมัคร
5. Career Path ในอนาคต
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return Response.json({
        roadmap: text,
    });
}