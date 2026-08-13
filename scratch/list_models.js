import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    const models = await genAI.listModels();
    console.log("Available models:");
    models.models.forEach(m => {
        console.log(`- ${m.name} (${m.supportedGenerationMethods})`);
    });
  } catch(e) { 
    console.log("❌ Error:", e.message); 
  }
}
run();
