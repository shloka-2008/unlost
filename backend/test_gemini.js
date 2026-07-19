import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const systemPrompt = "Test";

async function run() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: [
                { role: 'user', parts: [{ text: 'hi' }] }
            ],
            config: {
                systemInstruction: systemPrompt,
            }
        });
        console.log("SUCCESS:", response.text);
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}
run();
