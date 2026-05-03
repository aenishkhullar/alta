import { GoogleGenerativeAI } from '@google/generative-ai';
import { CHATBOT_SYSTEM_PROMPT } from '../utils/chatbotPrompt.js';

const lastRequestTime = {};

export const sendMessage = async (req, res) => {
    const ip = req.ip;
    const now = Date.now();
    if (lastRequestTime[ip] && now - lastRequestTime[ip] < 3000) {
        return res.status(429).json({
            error: 'Please wait a moment before sending another message.'
        });
    }
    lastRequestTime[ip] = now;

    try {
        const { message, history } = req.body;
        
        // Ensure history is an array
        const chatHistory = Array.isArray(history) ? history : [];
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: CHATBOT_SYSTEM_PROMPT,
        });

        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        return res.json({ reply });
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return res.status(500).json({ error: 'Failed to get response from AI' });
    }
};
