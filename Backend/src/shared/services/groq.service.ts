import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function groqGeneratedData(prompt: string) {
    const chatComplete = groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
    });

    return (await chatComplete).choices[0]?.message?.content || ""
}