import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY);

let genAI = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

// Helper for exponential backoff retry
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callWithRetry = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      // Check if it's a 503 (High demand) or 429 (Rate limit) error
      const isRetryable = error.message?.includes('503') || error.message?.includes('429') || error.message?.includes('high demand');
      
      if (isRetryable && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Gemini API busy (503/429). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

export const generateProjectData = async (formData) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [{ googleSearch: {} }]
  });

  const prompt = `
    You are a REAL-TIME INTERNET-CONNECTED RESEARCH AND ANALYSIS AGENT.
    
    YOUR RESPONSIBILITIES:
    1. Understand the user's idea (core problem, keywords, domain, intent).
    2. Perform LIVE INTERNET RESEARCH (blogs, docs, news, product sites).
    3. FILTER & CLEAN data (remove promotional/outdated content).
    4. CROSS-VERIFY information from at least 2-3 sources.
    5. GENERATE A STRUCTURED WORKSHOP REPORT (7 Sections).
    
    PROCESS (MANDATORY):
    - Fetch fresh data before answering.
    - Clearly base responses on real internet findings.
    - Summarize in simple, actionable language.
    - Prioritize accuracy over assumptions.
    
    STEP 1: RESEARCH
    Find 3-4 REAL WEBSITE SAMPLES (existing successful products).
    Collect data for the Workshop Report: Idea Overview, Research Summary, Solutions, Pros/Cons, Gaps, Best Practices, Action Plan.
    
    CRITICAL INSTRUCTION:
    1. For every subsequent step (Algorithms, Tech Specs, Flows), you MUST base your answer on how these specific REAL WEBSITE SAMPLES actually work.
    2. The URLs for realWorldSamples MUST be the ACTUAL, WORKING HOMEPAGE URLs of the products. Do NOT use fake or placeholder links.
    3. Determine the 'relevantTabs' array carefully. ALWAYS include "research", "wireframe", "ui", "phases", "spec", and "docs". Include "algo" only if complex custom logic/algorithms are required.
    4. EXTREMELY IMPORTANT: The user is a LAYMAN (non-technical). You MUST explain the Algorithms, Tech Stack, Guide, and 7 Phases using simple, easy-to-understand language. Do not use overly complex jargon without explaining it.
    5. TAILOR EVERYTHING TO THE INPUT. Do NOT generate generic examples. The algorithms, tech stack, and phases MUST specifically mention the features of the user's exact idea.
    
    STEP 2: GENERATE
    Based on your research and the user input below, generate a comprehensive technical specification, workshop report, and wireframe structure.
    
    User Input:
    Idea: ${formData.idea}
    Target Persona: ${formData.persona || "General Audience"}
    Platform: ${formData.platform || "Web"}
    Constraints: ${formData.constraints || "None"}
    
    STEP 3: FORMAT
    Return ONLY a raw JSON object with the following structure:
    
    {
      "concept": {
        "title": "Short catchy name",
        "description": "2 sentence summary"
      },
      "workshop": {
        "ideaOverview": "Brief overview of the core problem and market context.",
        "researchSummary": "Summary of internet research findings (trends, user behaviors).",
        "existingSolutions": ["Solution A (Description)", "Solution B (Description)"],
        "prosAndCons": [
           "Pro: Feature X is popular because...", 
           "Con: Many users complain about..."
        ],
        "gapsAndOpportunities": [
           "Gap: Most apps lack...", 
           "Opportunity: Build..."
        ],
        "bestPractices": ["Practice 1", "Practice 2"],
        "actionPlan": ["Step 1: Validate...", "Step 2: MVP Features..."],
        "finalRecommendation": "Strategic advice based on research."
      },
      "realWorldSamples": [
        { "name": "Website Name", "url": "https://actual-working-link.com", "description": "Specific relevance..." }
      ],
      "uiSuggestions": [
        { "searchQuery": "dashboard UI dark mode", "description": "A modern dark-themed analytics dashboard" },
        { "searchQuery": "mobile app login wireframe", "description": "Clean and minimal login screen" }
      ],
      "relevantTabs": [
        "research", 
        "wireframe", 
        "ui", 
        "flow", 
        "er", 
        "algo", 
        "phases", 
        "spec", 
        "docs"
      ],
      "wireframeData": [
        { "id": "1", "type": "header", "label": "Navigation/App Bar" },
        { "id": "2", "type": "hero", "label": "Hero/Intro Section" },
        // ... add 3-5 more components relevant to the idea. 
        // Available types: 'header', 'footer', 'hero', 'search', 'grid', 'list', 'feed', 'sidebar', 'chart', 'table', 'form', 'cta', 'row'.
        { "id": "99", "type": "footer", "label": "Footer/Tab Bar" }
      ],
      "algorithms": [
        {
          "name": "Specific Algorithm tailored to their idea (e.g. Matching Logic)",
          "description": "Explain exactly HOW this logic works in simple, layman terms relating directly to their specific idea.",
          "complexity": "Basic/Intermediate/Advanced"
        }
      ],
      "projectPhases": {
        "1": { "title": "Planning", "description": "...", "deliverables": "..." },
        "2": { "title": "Design", "description": "...", "deliverables": "..." },
        "3": { "title": "Development", "description": "...", "deliverables": "..." },
        "4": { "title": "Testing", "description": "...", "deliverables": "..." },
        "5": { "title": "Deployment", "description": "...", "deliverables": "..." }
      },
      "techSpec": {
        "frontend": [
           { "name": "Recommended Framework", "isBest": true, "reason": "Short relatable explanation why it's best for this prompt" }
        ],
        "backend": [
           { "name": "Recommended Stack", "isBest": true, "reason": "Short relatable explanation why it's best for this prompt" }
        ],
        "database": [
           { "name": "Recommended DB", "isBest": true, "reason": "Short relatable explanation why it's best for this prompt" }
        ],
        "auth": [
           { "name": "Recommended Provider", "isBest": true, "reason": "Short relatable explanation why it's best for this prompt" }
        ],
        "dataModel": [
           { "entity": "Entity Name (e.g., User)", "attributes": "id, name, email" }
        ],
        "fileStructure": "A string formatted as exactly like a linux bash 'tree' command output (ASCII art) to show how files should be organized for this project. E.g. src/ \\n ├─ components/ \\n ├─ pages/ ...",
        "learningPath": {
          "beginner": { "level": "Beginner", "description": "...", "tools": [], "resources": [], "hints": "..." },
          "intermediate": { "level": "Intermediate", "description": "...", "tools": [], "resources": [], "hints": "..." },
          "advanced": { "level": "Advanced", "description": "...", "tools": [], "resources": [], "hints": "..." }
        }
      },
      "documentation": {
        "executiveSummary": "...",
        "systemArchitecture": "...",
        "developmentRoadmap": [
             { "phase": "Phase 1", "steps": ["step 1", "step 2"] }
        ],
        "testingStrategy": "...",
        "deploymentGuide": "..."
      },
       "milestones": [
          { "title": "Milestone 1", "description": "...", "duration": "...", "complexity": "..." }
       ]
    }
    `;

  try {
    let apiResult;
    const text = await callWithRetry(async () => {
      const result = await model.generateContent(prompt);
      apiResult = result;
      return result.response.text();
    });

    console.log("Gemini Raw Response:", text); // Debug log

    // Clean up markdown code blocks if present
    let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Find the first '{' and the last '}' to ensure we extract just the JSON
    const firstOpen = cleanedText.indexOf('{');
    const lastClose = cleanedText.lastIndexOf('}');

    if (firstOpen !== -1 && lastClose !== -1) {
      cleanedText = cleanedText.substring(firstOpen, lastClose + 1);
    }

    const jsonData = JSON.parse(cleanedText);

    // Extract Grounding Metadata
    const groundingMetadata = apiResult?.response?.candidates?.[0]?.groundingMetadata;
    const researchData = {
      queries: groundingMetadata?.webSearchQueries || [],
      sources: groundingMetadata?.groundingChunks?.map(c => c.web?.uri).filter(Boolean) || [],
      titles: groundingMetadata?.groundingChunks?.map(c => c.web?.title).filter(Boolean) || []
    };

    console.log("Extracted Research Data:", researchData);

    return {
      ...jsonData,
      research: researchData
    };
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
};

export const generateSingleDiagram = async (promptText) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert Mermaid.js diagram generator.
    The user wants to generate a diagram based on the following text:
    ---
    ${promptText}
    ---
    
    INSTRUCTIONS:
    1. Analyze the text and determine the most appropriate Mermaid.js diagram type (e.g., flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, pie, gantt, mindmap, timeline).
    2. Respond ONLY with the raw, valid Mermaid.js syntax for that diagram.
    3. DO NOT wrap the response in markdown code blocks (e.g., no \`\`\`mermaid ... \`\`\`).
    4. DO NOT include any explanations or extra text. JUST THE MERMAID CODE.
    5. If generating a timeline diagram, ensure there are NO leading spaces before the word "timeline" and separate elements exactly as required by Mermaid timeline rules (e.g. sections and colon-separated topics/events).
    
    EXAMPLE FOR TIMELINE:
    timeline
        title History of Programming
        1950s : Fortran : Lisp
        1960s : COBOL : BASIC
        1970s : C : SQL
        [...and so on...]
  `;

  try {
    const text = await callWithRetry(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });
    
    let cleanText = text.trim();
    // Sometimes the model still outputs markdown formats despite instructions, clean it up completely:
    if (cleanText.startsWith('\`\`\`')) {
        // Strip out the first line ```mermaid and the last line ```
        cleanText = cleanText.split('\n').slice(1, -1).join('\n');
    }
    // Final check to remove any remaining ``` if the above didn't catch the exact combo
    cleanText = cleanText.replace(/\`\`\`(mermaid)?/gi, '').replace(/\`\`\`/g, '').trim();

    // Verify it starts with a known valid keyword
    const validStartTokens = ['graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram-v2', 'pie', 'gantt', 'mindmap', 'timeline', 'gitGraph', 'erDiagram', 'journey', 'quadrantChart'];
    
    const isValid = validStartTokens.some(token => cleanText.startsWith(token));
    if (!isValid) {
        // Try finding the first valid token and cutting from there
        for(let token of validStartTokens) {
            const index = cleanText.indexOf(token);
            if (index !== -1) {
                cleanText = cleanText.substring(index);
                break;
            }
        }
    }

    return cleanText;
  } catch (error) {
    console.error("Gemini Diagram Error:", error);
    throw new Error(`Failed to generate diagram: ${error.message}`);
  }
};

export const generateChatResponse = async (chatHistory) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: {
      parts: [{
        text: `
        You are the official WireFrameAI Website Assistant. 
        Your goal is to help users with any problems or questions regarding the WireFrameAI website.
        
        ABOUT WIREFRAMEAI:
        - Purpose: An AI-powered platform that transforms app ideas into technical specifications and interactive wireframes.
        - Key Features:
          - Diagram Studio: Generates professional diagrams (Flowcharts, Sequence, Class, ER, etc.) using Mermaid.js syntax. Users can zoom and pan diagrams.
          - Wireframe Canvas: Generates a visual layout of UI components that can be reordered via drag-and-drop.
          - Tech Spec Generator: Recommends specialized tech stacks (Frontend, Backend, Database) based on the user's idea.
          - Workspace: A centralized tabbed interface to view Research, Wireframes, UI Suggestions, Project Phases, and Full Documentation.
          - Research Tab: Performs real-time internet research to find existing successful products and market gaps related to the user's idea.
        
        TONE & STYLE:
        - Helpful, professional, and slightly futuristic.
        - Prioritize clarity. If a user is confused, guide them step-by-step through the "Idea -> Generation -> Workspace" flow.
        - Keep responses concise. Max 3-4 sentences unless a detailed explanation is requested.
        
        USER CONTEXT:
        - The user is currently in the Help Center. 
        - They might be looking for troubleshooting or "how-to" advice.
      ` }]
    }
  });

  try {
    // Gemini SDK requires history to start with 'user' and alternate user/model
    let geminiHistory = chatHistory.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Find the first user message index to ensure history starts with user
    const firstUserIdx = geminiHistory.findIndex(m => m.role === 'user');
    if (firstUserIdx !== -1) {
      geminiHistory = geminiHistory.slice(firstUserIdx);
    } else {
      geminiHistory = [];
    }

    const chat = model.startChat({
      history: geminiHistory,
    });

    const lastMessage = chatHistory[chatHistory.length - 1].content;
    const text = await callWithRetry(async () => {
      const result = await chat.sendMessage(lastMessage);
      return result.response.text();
    });
    return text;
  } catch (error) {
    console.error("Gemini Chat Detail Error:", error);
    throw new Error(`Assistant Error: ${error.message || "Failed to connect to AI Service"}`);
  }
};

export const generateChatStreamingResponse = async (chatHistory, onChunk) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: {
      parts: [{
        text: `
        You are the official WireFrameAI Website Assistant. 
        Your goal is to help users with any problems or questions regarding the WireFrameAI website.
        
        ABOUT WIREFRAMEAI:
        - Purpose: An AI-powered platform that transforms app ideas into technical specifications and interactive wireframes.
        - Key Features:
          - Diagram Studio: Generates professional diagrams (Flowcharts, Sequence, Class, ER, etc.) using Mermaid.js syntax. Users can zoom and pan diagrams.
          - Wireframe Canvas: Generates a visual layout of UI components that can be reordered via drag-and-drop.
          - Tech Spec Generator: Recommends specialized tech stacks (Frontend, Backend, Database) based on the user's idea.
          - Workspace: A centralized tabbed interface to view Research, Wireframes, UI Suggestions, Project Phases, and Full Documentation.
          - Research Tab: Performs real-time internet research to find existing successful products and market gaps related to the user's idea.
        
        TONE & STYLE:
        - Helpful, professional, and slightly futuristic.
        - Prioritize clarity. If a user is confused, guide them step-by-step through the "Idea -> Generation -> Workspace" flow.
        - Keep responses concise. Max 3-4 sentences unless a detailed explanation is requested.
      ` }]
    }
  });

  try {
    // Gemini SDK requires history to start with 'user' and alternate user/model
    let geminiHistory = chatHistory.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Find the first user message index
    const firstUserIdx = geminiHistory.findIndex(m => m.role === 'user');
    if (firstUserIdx !== -1) {
      geminiHistory = geminiHistory.slice(firstUserIdx);
    } else {
      geminiHistory = [];
    }

    const chat = model.startChat({
      history: geminiHistory,
    });

    const lastMessage = chatHistory[chatHistory.length - 1].content;
    const result = await chat.sendMessageStream(lastMessage);

    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      onChunk(fullText);
    }

    return fullText;
  } catch (error) {
    console.error("Gemini Chat Streaming Detail Error:", error);
    // Log the full error to help debug why 'gemini-2.5-flash' might be failing
    console.log("Full Error Object:", JSON.stringify(error, null, 2));
    throw new Error(`Assistant Error: ${error.message || "Failed to start conversation stream"}`);
  }
};

export const generateHtmlCssDesign = async (promptText) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert Frontend Web Developer and UI/UX Architect.
    The user wants to generate a simple, modern design using HTML and CSS based on the following request:
    ---
    ${promptText}
    ---
    
    INSTRUCTIONS:
    1. Respond with a single, complete HTML file structure starting with <!DOCTYPE html> and ending with </html>.
    2. Include all CSS within a <style> tag in the <head>.
    3. Make it self-contained, using modern styling. Use CSS Grid or Flexbox extensively if the user asks for a complex physical layout (like a store map, factory layout, architecture floor plan).
    4. Provide clear labels and visual distinction for different sections.
    5. Do not include any explanations, markdown code block formatting (like \`\`\`html or \`\`\`), just the raw HTML code.
    6. Ensure the design is clean, professional, non-overlapping, and ready to render in an iframe.
  `;

  try {
    const text = await callWithRetry(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });
    
    let cleanText = text.trim();
    
    // Fallback cleanup if the model includes markdown blocks despite instructions
    if (cleanText.includes('```html')) {
      cleanText = cleanText.split('```html')[1];
      if (cleanText.includes('```')) {
        cleanText = cleanText.split('```')[0];
      }
    } else if (cleanText.includes('```')) {
      // Just generic markdown block
      const parts = cleanText.split('```');
      if (parts.length > 1) {
        cleanText = parts[1];
      }
    }

    // Force extraction of the HTML document
    const htmlStart = cleanText.indexOf('<html');
    const doctypeStart = cleanText.toLowerCase().indexOf('<!doctype html>');
    
    const startIdx = doctypeStart !== -1 ? doctypeStart : (htmlStart !== -1 ? htmlStart : 0);
    const endIdx = cleanText.lastIndexOf('</html>');

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        cleanText = cleanText.substring(startIdx, endIdx + 7); // +7 for </html>
    }

    return cleanText.trim();
  } catch (error) {
    console.error("Gemini HTML/CSS Gen Error:", error);
    throw new Error(`Failed to generate code: ${error.message}`);
  }
};

export const generateHtmlCssDesignStreaming = async (promptText, onChunk) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert Frontend Web Developer and UI/UX Architect.
    The user wants to generate a simple, modern design using HTML and CSS based on the following request:
    ---
    ${promptText}
    ---
    
    INSTRUCTIONS:
    1. Respond with a single, complete HTML file structure starting with <!DOCTYPE html> and ending with </html>.
    2. Include all CSS within a <style> tag in the <head>.
    3. Make it self-contained, using modern styling.
    4. Provide clear labels and visual distinction for different sections.
    5. Do NOT include any explanations, markdown code block formatting (like \`\`\`html or \`\`\`), JUST THE RAW HTML CODE.
    6. Ensure the design is clean and professional.
  `;

  try {
    const result = await model.generateContentStream(prompt);
    let fullText = "";
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      
      // Attempt to clean up markdown if it starts appearing
      let processed = fullText;
      if (processed.includes('```html')) {
          processed = processed.split('```html')[1] || "";
      } else if (processed.includes('```')) {
          processed = processed.split('```')[1] || "";
      }
      
      onChunk(processed.trim());
    }
    
    return fullText;
  } catch (error) {
    console.error("Gemini HTML/CSS Streaming Error:", error);
    throw new Error(`Failed to generate code: ${error.message}`);
  }
};

export const generateGeneralCode = async (promptText) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert Polyglot Programmer and Coding Tutor.
    The user has a coding question or request:
    ---
    ${promptText}
    ---
    
    INSTRUCTIONS:
    1. Provide a helpful, structured response that answers EXACTLY what the user asked.
    2. DO NOT provide multiple variations, similar examples, or answer unasked questions. Provide exactly ONE primary solution or answer unless explicitly asked for more.
    3. Use markdown formatting: headings (##), bold (**text**), emojis, and numbered lists for clarity.
    4. Include all code inside fenced code blocks with the correct language label (e.g., \`\`\`c, \`\`\`python, \`\`\`javascript, \`\`\`java, etc.).
    5. The code block should be a complete, runnable program.
    6. Add a brief 1-2 line explanation before the code block describing what it does.
    7. Keep explanations concise but friendly. Use simple language.
    8. Do NOT include output/execution results.
  `;

  try {
    const text = await callWithRetry(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });
    return text.trim();
  } catch (error) {
    console.error("Gemini General Code Gen Error:", error);
    throw new Error(`Failed to generate code: ${error.message}`);
  }
};

export const generateGeneralCodeStreaming = async (promptText, onChunk) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert Polyglot Programmer and Coding Tutor.
    The user has a coding question or request:
    ---
    ${promptText}
    ---
    
    INSTRUCTIONS:
    1. Provide a helpful, structured response that answers EXACTLY what the user asked.
    2. Use markdown formatting (headings, bold, lists).
    3. Include code inside fenced code blocks with language labels.
    4. Keep it concise but friendly.
  `;

  try {
    const result = await model.generateContentStream(prompt);
    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      onChunk(fullText);
    }
    return fullText;
  } catch (error) {
    console.error("Gemini General Code Streaming Error:", error);
    throw new Error(`Failed to generate code: ${error.message}`);
  }
};

export const generateVectorSvg = async (promptText) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert SVG Illustrator and UI Designer.
    Generate a high-quality, scalable vector graphic (SVG) based on this request: "${promptText}".
    
    INSTRUCTIONS:
    1. Respond ONLY with the raw SVG code starting with <svg and ending with </svg>.
    2. Ensure the SVG is self-contained, responsive (use viewBox, not hardcoded width/height if possible), and modern.
    3. Use a clean, professional color palette (gradients allowed).
    4. Do NOT include any explanations or markdown blocks.
    5. The SVG should be complex enough to be useful (e.g., if it's a dashboard, include icons, charts, or layout elements).
  `;

  try {
    const text = await callWithRetry(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });
    
    let cleanText = text.trim();
    if (cleanText.includes('```xml')) cleanText = cleanText.split('```xml')[1].split('```')[0];
    if (cleanText.includes('```svg')) cleanText = cleanText.split('```svg')[1].split('```')[0];
    if (cleanText.includes('```html')) cleanText = cleanText.split('```html')[1].split('```')[0];
    
    const startIdx = cleanText.indexOf('<svg');
    const endIdx = cleanText.lastIndexOf('</svg>');
    
    if (startIdx !== -1 && endIdx !== -1) {
      return cleanText.substring(startIdx, endIdx + 6).trim();
    }
    return cleanText;
  } catch (error) {
    console.error("SVG Gen Error:", error);
    throw error;
  }
};

export const fetchPexelsHighRes = async (query) => {
  const apiKey = "jdjYu3svbYXrHxzzDYafetwBcqigutMV0BMRs3QnxOrThX7b0mfSGkiT";
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`;
  
  try {
    const response = await fetch(url, { headers: { Authorization: apiKey } });
    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[Math.floor(Math.random() * Math.min(data.photos.length, 3))];
      return {
        url: photo.src.original || photo.src.large2x,
        downloadUrl: photo.src.original,
        photographer: photo.photographer
      };
    }
    return null;
  } catch (error) {
    console.error("Pexels error:", error);
    return null;
  }
};
