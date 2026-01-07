import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function groqGeneratedData(prompt: string) {
    const chatComplete = groq.chat.completions.create({
        messages: [
            {
                role: "assistant",
                content: prompt
            }
        ],
        model: "openai/gpt-oss-120b"
    });

    return (await chatComplete).choices[0]?.message?.content || ""
}