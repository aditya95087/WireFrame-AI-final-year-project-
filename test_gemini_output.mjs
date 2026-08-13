import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const { generateProjectData } = await import('./src/services/gemini.js');
    const data = await generateProjectData({
      idea: "A fitness tracking app for gym goers",
      persona: "Gym Goers",
      platform: "web",
      constraints: "none"
    });
    console.log("Returned Keys:", Object.keys(data));
    console.log("Has uiSuggestions:", !!data.uiSuggestions);
    if (data.uiSuggestions) console.log(data.uiSuggestions);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
