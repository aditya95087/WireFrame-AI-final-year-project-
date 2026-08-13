# WireframeAI – End-to-End Intelligent Design System

WireframeAI is an AI-powered web application that transforms natural-language ideas into **wireframes, UML diagrams, flowcharts, ER diagrams, charts, and project documentation** in real time.

The platform uses **Google Gemini AI** to understand user requirements and **Mermaid.js** to generate and visualize diagrams interactively. It is designed to help developers, designers, students, and teams quickly convert ideas into structured visual designs.

---

## 🚀 Features

* 🤖 **AI-Powered Wireframe Generation**

  * Convert natural-language descriptions into structured wireframes.
  * Generate designs from simple prompts.

* 📊 **Diagram Generation**

  * UML Diagrams
  * Flowcharts
  * ER Diagrams
  * Pie Charts
  * Gantt Charts
  * Other Mermaid-supported diagrams

* 🎨 **Interactive Visualization**

  * Real-time diagram rendering using Mermaid.js.
  * Interactive preview of generated designs.

* 🎤 **Voice-to-Text**

  * Describe your idea using voice input.
  * Convert voice instructions into prompts for AI generation.

* 🔐 **Secure Authentication**

  * User registration and login.
  * Google-based authentication using Google Cloud Console.

* 👤 **User Management**

  * User profile and project management.
  * Save and manage generated designs.

* 🛠️ **Admin Dashboard**

  * Manage registered users.
  * Monitor application activity and system data.

* 📤 **Export Designs**

  * Export generated diagrams and designs in:

    * PNG
    * SVG
    * PDF
    * JSON

* 🔎 **Search & Management**

  * Search generated projects and diagrams.
  * Manage previously created designs.

* 🧪 **Diagram Stress Testing**

  * Test generated diagrams with different prompts.
  * Improve diagram structure and output through AI-assisted prompts.

---

## 🧠 How WireframeAI Works

```text
User Idea
    ↓
Natural Language / Voice Input
    ↓
Google Gemini AI
    ↓
Prompt Processing
    ↓
Wireframe / Diagram Generation
    ↓
Mermaid.js Visualization
    ↓
Interactive Preview
    ↓
Export / Save / Manage
```

---

## 🏗️ Core Modules

### 1. User Module

* Registration
* Login
* Authentication
* User profile
* Project management

### 2. Admin Module

* Admin authentication
* Dashboard
* User management
* Application monitoring

### 3. AI Generation Module

* Natural-language processing
* AI-powered wireframe generation
* Diagram generation
* Prompt-based design generation

### 4. Diagram Visualization Module

* Real-time Mermaid rendering
* Interactive previews
* Diagram editing and regeneration

### 5. Search & Management Module

* Search projects
* Manage generated designs
* Store and retrieve previous work

### 6. Export Module

Generated designs can be exported as:

`PNG` | `SVG` | `PDF` | `JSON`

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript
* Mermaid.js

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Artificial Intelligence

* Google Gemini API

### Authentication

* Google Cloud Console
* Secure authentication system

### APIs & Tools

* Pexels API
* Mermaid.js
* Google Gemini
* Git & GitHub

---

## 📁 Project Architecture

```text
WireframeAI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── README.md
└── package.json
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/wireframe-ai.git
cd wireframe-ai
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

Add any additional API/authentication keys required by your implementation.

### 5. Start the Backend

```bash
cd backend
npm run dev
```

### 6. Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

| Variable         | Description                         |
| ---------------- | ----------------------------------- |
| `PORT`           | Backend server port                 |
| `MONGODB_URI`    | MongoDB database connection         |
| `GEMINI_API_KEY` | Google Gemini API key               |
| `FRONTEND_URL`   | Frontend URL for CORS configuration |

**Never commit your `.env` file or API keys to GitHub.**

---

## 🎯 Use Cases

WireframeAI can be used for:

* 💻 Software project planning
* 🎨 UI/UX wireframing
* 📐 System architecture visualization
* 🗄️ Database design
* 🔄 Process and workflow visualization
* 📚 Academic projects
* 👨‍💻 Developer documentation
* 🏢 Business process planning
* 🚀 Rapid prototyping

---

## 🌟 Why WireframeAI?

Traditional wireframing and diagram creation can require significant manual effort. WireframeAI simplifies this process by allowing users to **describe what they want in natural language** and letting AI generate a structured visual representation.

This makes the design and planning process faster, more interactive, and easier to understand.

---

## 🔮 Future Enhancements

* Real-time collaborative editing
* Advanced UI wireframe generation
* More diagram formats
* AI-powered design recommendations
* Project sharing
* Team collaboration
* Version history
* Cloud project storage
* Improved voice-based design generation

---

## 👨‍💻 Developer

**Aditya Kumar**

Full Stack Developer | AI Enthusiast

### Technologies

`React` `Node.js` `Express.js` `MongoDB` `JavaScript` `Tailwind CSS` `Gemini AI` `Mermaid.js`

---

## 📄 License

This project is developed for educational, experimental, and portfolio purposes.
