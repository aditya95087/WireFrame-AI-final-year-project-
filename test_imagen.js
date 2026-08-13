import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    console.log("Testing Imagen 3 with key:", apiKey.substring(0, 5) + "...");
    const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });
    const result = await model.generateContent("A modern dashboard UI dark mode");
    
    if (result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        console.log("✅ Image generated successfully!");
        console.log("Mime Type:", result.response.candidates[0].content.parts[0].inlineData.mimeType);
    } else {
        console.log("❌ No image data in response.");
        console.log("Full response:", JSON.stringify(result.response, null, 2));
    }
  } catch(e) { 
    console.log("❌ Error:", e.message); 
  }
}
run();
