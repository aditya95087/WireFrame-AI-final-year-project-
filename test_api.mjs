import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCWzzZBRF00acDkNxGG0omEB8oWCMasVSk";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("hello");
    console.log("Gemini text works:", !!result.response.text());
  } catch(e) { 
    console.log("Gemini text failed:", e.message); 
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt: "A modern dashboard UI dark mode" }],
        parameters: { sampleCount: 1 }
      })
    });
    const data = await response.json();
    console.log("Imagen works:", !!data.predictions);
    if (!data.predictions) console.log(data);
  } catch(e) {
    console.log("Imagen fetch failed:", e.message);
  }
}

run();
