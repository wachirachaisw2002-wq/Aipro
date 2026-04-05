import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { message } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
        });

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: message }],
                },
            ],
        });

        const response = await result.response;
        const text = response.text();

        return Response.json({ reply: text });

    } catch (error) {
        console.error(error);

        return Response.json({
            reply: "AI เกิดข้อผิดพลาด",
        });
    }
}