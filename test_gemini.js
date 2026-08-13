
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API Key found in env.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];

    for (const modelName of models) {
        console.log(`Testing ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            console.log(`SUCCESS: ${modelName}`);
            // console.log(result.response.text());
            return; // Exit on first success
        } catch (e) {
            console.log(`FAILED: ${modelName} - ${e.message}`);
        }
    }
    console.log("ALL MODELS FAILED.");
}

run();
