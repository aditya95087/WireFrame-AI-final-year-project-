import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ImageGenerationSection from './components/ImageGenerationSection';
import ProcessSection from './components/ProcessSection';
import ScrollingBanner from './components/ScrollingBanner';
import Footer from './components/Footer';
import IdeaForm from './components/IdeaForm';
import Workspace from './components/Workspace';
import PageLoader from './components/PageLoader';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import HelpCenter from './components/HelpCenter';
import Documentation from './components/Documentation';
import APIReference from './components/APIReference';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ScrollToTop from './components/ScrollToTop';
import DiagramMaker from './components/DiagramMaker';
import CodeGenerator from './components/CodeGenerator';
import AdminAuth from './components/AdminAuth';
import AdminDashboard from './components/AdminDashboard';
import CustomCursor from './components/CustomCursor';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { generateProjectData } from './services/gemini';

// Mock Data Generator
const generateMockData = (formData) => {
  const isMobile = formData.platform === 'mobile';
  const ideaText = formData.idea || "Project";
  const lowerIdea = ideaText.toLowerCase();

  // Generate a title
  const title = ideaText.split(' ').slice(0, 3).join(' ') + (ideaText.split(' ').length > 3 ? "..." : "");

  // Define component pools
  const commonComponents = [
    { id: 'nav', type: 'header', label: isMobile ? 'App Bar / Navigation' : 'Navigation Bar' },
    { id: 'footer', type: 'footer', label: isMobile ? 'Bottom Tab Bar' : 'Footer' }
  ];

  let specificComponents = [];
  let mermaidNodes = [];
  let dataModelEntities = [];

  // Logic for different app types
  let mainFeature = 'Core Feature';
  if (lowerIdea.includes('shop') || lowerIdea.includes('store') || lowerIdea.includes('commerce') || lowerIdea.includes('buy')) {
    mainFeature = 'E-commerce';
    // E-commerce
    specificComponents = [
      { id: 'hero', type: 'hero', label: 'Promotional Banner / Hero' },
      { id: 'search', type: 'search', label: 'Search & Filters' },
      { id: 'products', type: 'grid', label: 'Product Grid' },
      { id: 'cart', type: 'list', label: 'Shopping Cart Preview' }
    ];
    mermaidNodes = [
      'A[Home] --> B[Product Search]',
      'B --> C[Product Details]',
      'C --> D[Add to Cart]',
      'D --> E[Checkout Flow]',
      'E --> F{Payment Success?}',
      'F -- Yes --> G[Order Confirmation]',
      'F -- No --> E'
    ];
    dataModelEntities = [
      `Product { id: UUID, name: String, price: Decimal, stock: Int }`,
      `Order { id: UUID, user_id: UUID, total: Decimal, status: String }`,
      `OrderItem { id: UUID, order_id: UUID, product_id: UUID, quantity: Int }`
    ];
  } else if (lowerIdea.includes('social') || lowerIdea.includes('chat') || lowerIdea.includes('connect') || lowerIdea.includes('community')) {
    mainFeature = 'Social Networking';
    // Social Media
    specificComponents = [
      { id: 'stories', type: 'row', label: 'Stories / Status Updates' },
      { id: 'feed', type: 'feed', label: 'Main Feed (Posts)' },
      { id: 'create', type: 'input', label: 'Create Post Input' },
      { id: 'sidebar', type: 'sidebar', label: 'Trending / Suggestions' }
    ];
    mermaidNodes = [
      'A[Feed] --> B[View Post]',
      'A --> C[Create Post]',
      'B --> D[Like/Comment]',
      'A --> E[User Profile]',
      'E --> F[Edit Profile]',
      'A --> G[Messages]'
    ];
    dataModelEntities = [
      `Post { id: UUID, user_id: UUID, content: Text, likes: Int }`,
      `Comment { id: UUID, post_id: UUID, user_id: UUID, text: Text }`,
      `Follow { follower_id: UUID, following_id: UUID }`
    ];
  } else if (lowerIdea.includes('dashboard') || lowerIdea.includes('analytics') || lowerIdea.includes('admin') || lowerIdea.includes('manage')) {
    mainFeature = 'Analytics Dashboard';
    // Dashboard / SaaS
    specificComponents = [
      { id: 'sidebar', type: 'sidebar', label: 'Admin Sidebar' },
      { id: 'stats', type: 'grid', label: 'Key Statistics Cards' },
      { id: 'chart', type: 'chart', label: 'Main Analytics Chart' },
      { id: 'table', type: 'table', label: 'Recent Transactions / Data' }
    ];
    mermaidNodes = [
      'A[Login] --> B[Dashboard]',
      'B --> C[View Analytics]',
      'B --> D[Manage Users]',
      'B --> E[Settings]',
      'D --> F[Edit User]',
      'D --> G[Delete User]'
    ];
    dataModelEntities = [
      `Analytics { id: UUID, metric: String, value: Float, date: Timestamp }`,
      `Log { id: UUID, action: String, user_id: UUID, timestamp: Timestamp }`
    ];
  } else if (lowerIdea.includes('blog') || lowerIdea.includes('news') || lowerIdea.includes('article') || lowerIdea.includes('content')) {
    mainFeature = 'Content Management';
    // Content / Blog
    specificComponents = [
      { id: 'featured', type: 'hero', label: 'Featured Article' },
      { id: 'categories', type: 'row', label: 'Category Pills' },
      { id: 'list', type: 'list', label: 'Recent Articles List' },
      { id: 'newsletter', type: 'form', label: 'Newsletter Signup' }
    ];
    mermaidNodes = [
      'A[Home] --> B[Article List]',
      'B --> C[Read Article]',
      'C --> D[Share/Comment]',
      'C --> E[Related Articles]',
      'A --> F[Search Archives]'
    ];
    dataModelEntities = [
      `Article { id: UUID, title: String, content: Text, author_id: UUID }`,
      `Category { id: UUID, name: String, slug: String }`
    ];
  } else {
    // Default / Generic
    specificComponents = [
      { id: 'hero', type: 'hero', label: isMobile ? 'Hero Card' : 'Hero Section' },
      { id: 'features', type: 'grid', label: 'Key Features' },
      { id: 'cta', type: 'cta', label: 'Call to Action' }
    ];
    mermaidNodes = [
      'A[Landing Page] --> B{User Logged In?}',
      'B -- No --> C[Login/Signup]',
      'B -- Yes --> D[Dashboard]',
      'D --> E[Main Feature]',
      'E --> D'
    ];
    dataModelEntities = [
      `Item { id: UUID, name: String, description: Text }`
    ];
  }

  // Admin Workflow Nodes
  let adminMermaidNodes = [];
  if (lowerIdea.includes('shop')) {
    adminMermaidNodes = [
      'A[Admin Login] --> B[Dashboard]',
      'B --> C[Manage Orders]',
      'C --> D{Order Status}',
      'D -- New --> E[Process Order]',
      'D -- Shipped --> F[Track Shipment]',
      'B --> G[Manage Inventory]',
      'G --> H[Add/Edit Product]'
    ];
  } else if (lowerIdea.includes('social')) {
    adminMermaidNodes = [
      'A[Admin Login] --> B[Dashboard]',
      'B --> C[User Management]',
      'C --> D[Ban/Suspend User]',
      'B --> E[Content Moderation]',
      'E --> F{Flagged Content}',
      'F -- Safe --> G[Approve]',
      'F -- Violation --> H[Delete Post]'
    ];
  } else {
    adminMermaidNodes = [
      'A[Admin Login] --> B[Dashboard]',
      'B --> C[User Management]',
      'B --> D[System Settings]',
      'B --> E[View Analytics]',
      'E --> F[Export Reports]'
    ];
  }

  // Assemble Wireframe
  const wireframeData = [
    commonComponents[0], // Header
    ...specificComponents,
    commonComponents[1]  // Footer
  ].map((comp, index) => ({ ...comp, id: `${index + 1}` }));

  // ER Diagram Data
  let erDiagramString = '';
  if (lowerIdea.includes('shop') || lowerIdea.includes('store')) {
    erDiagramString = `
      erDiagram
        USER ||--o{ ORDER : places
        USER {
            string username
            string email
            string password_hash
        }
        ORDER ||--|{ ORDER_ITEM : contains
        ORDER {
            uuid id
            uuid user_id
            float total
            string status
        }
        PRODUCT ||--o{ ORDER_ITEM : "included in"
        PRODUCT {
            uuid id
            string name
            float price
            int stock
        }
    `;
  } else if (lowerIdea.includes('social') || lowerIdea.includes('chat')) {
    erDiagramString = `
      erDiagram
        USER ||--o{ POST : creates
        USER ||--o{ COMMENT : writes
        USER {
            uuid id
            string username
            string bio
        }
        POST ||--o{ COMMENT : has
        POST {
            uuid id
            uuid user_id
            string content
            timestamp created_at
        }
        COMMENT {
            uuid id
            uuid post_id
            uuid user_id
            string text
        }
    `;
  } else {
    erDiagramString = `
      erDiagram
        USER ||--o{ ITEM : owns
        USER {
            uuid id
            string email
        }
        ITEM {
            uuid id
            string name
            string description
        }
    `;
  }

  // Algorithms
  let algorithms = [
    {
      name: "Authentication Flow",
      description: "Implements a secure, token-based authentication system. When a user logs in, the server validates credentials and issues a JSON Web Token (JWT). This token is signed with a secret key and contains user claims. For subsequent requests, the client sends this token in the Authorization header. The server verifies the signature to grant access to protected routes, ensuring stateless and scalable security.",
      complexity: "O(1)"
    }
  ];
  if (lowerIdea.includes('shop')) {
    algorithms.push(
      {
        name: "Product Recommendation Engine",
        description: "Utilizes Collaborative Filtering to personalize the shopping experience. By analyzing the purchase history and browsing behavior of similar users, the system predicts products the current user is likely to buy. This involves constructing a user-item matrix and calculating similarity scores (e.g., Cosine Similarity) to rank and suggest relevant items.",
        complexity: "O(N^2)"
      },
      {
        name: "Search Indexing & Retrieval",
        description: "Employs an Inverted Index structure to enable sub-second product searches. Each unique word in product descriptions maps to a list of product IDs. When a user queries 'running shoes', the system intersects the lists for 'running' and 'shoes' to find matches instantly, rather than scanning every product row.",
        complexity: "O(log N)"
      }
    );
  } else if (lowerIdea.includes('social')) {
    algorithms.push(
      {
        name: "Feed Ranking Algorithm",
        description: "Determines the order of posts in a user's feed based on relevance scores. The score is calculated using a weighted sum of factors: Recency (time since post), Affinity (interaction frequency with the author), and Popularity (number of likes/comments). This ensures users see the most engaging content first.",
        complexity: "O(N log N)"
      },
      {
        name: "Social Graph Traversal",
        description: "Uses Breadth-First Search (BFS) to discover connection pathways. This is essential for features like 'People You May Know' or finding mutual friends. Starting from the current user node, the algorithm explores neighboring nodes (friends) and their neighbors (friends of friends) to identify potential connections.",
        complexity: "O(V+E)"
      }
    );
  } else {
    algorithms.push(
      {
        name: "Data Sorting & Filtering",
        description: "Implements an optimized QuickSort algorithm to handle large lists of items. This allows users to sort data by various attributes (date, name, size) efficiently. The algorithm selects a 'pivot' element and partitions the array into sub-arrays of smaller and larger elements, recursively sorting them.",
        complexity: "O(N log N)"
      }
    );
  }

  // Project Phases
  const projectPhases = {
    1: { title: "Planning", description: "Define scope, requirements, and timeline.", deliverables: "Project Charter, SRS" },
    2: { title: "Analysis", description: "Analyze user needs and system feasibility.", deliverables: "Feasibility Report, Use Cases" },
    3: { title: "Design", description: "Create wireframes, UI/UX, and system architecture.", deliverables: "Design Mockups, DB Schema" },
    4: { title: "Implementation", description: "Write code for frontend, backend, and database.", deliverables: "Source Code, API Docs" },
    5: { title: "Testing", description: "Unit, integration, and system testing.", deliverables: "Test Plan, Bug Reports" },
    6: { title: "Deployment", description: "Deploy to production servers (AWS/Vercel).", deliverables: "Live URL, CI/CD Pipeline" },
    7: { title: "Maintenance", description: "Monitor performance and fix post-launch bugs.", deliverables: "Maintenance Log, Updates" }
  };

  // Learning Path Resources
  let learningPath = {
    beginner: {
      level: "Beginner",
      description: "No-code/Low-code tools to get started quickly without deep programming knowledge.",
      tools: ["Bubble.io", "Glide Apps", "Airtable"],
      resources: ["Bubble Academy", "No-Code Founders Community"],
      hints: "Focus on validating your idea first. Don't worry about scalability yet."
    },
    intermediate: {
      level: "Intermediate",
      description: "Standard web/mobile development using popular frameworks and managed services.",
      tools: ["React / Next.js", "Supabase / Firebase", "Vercel"],
      resources: ["React Documentation", "Supabase Crash Course", "Tailwind CSS Labs"],
      hints: "Learn about state management and API integration. Ensure your database schema is normalized."
    },
    advanced: {
      level: "Advanced",
      description: "Enterprise-grade architecture for high scalability and performance.",
      tools: ["Kubernetes", "AWS Lambda", "Redis", "GraphQL"],
      resources: ["System Design Primer", "AWS Well-Architected Framework"],
      hints: "Focus on caching strategies, microservices, and CI/CD pipelines. Monitor performance metrics."
    }
  };

  if (lowerIdea.includes('shop')) {
    learningPath.beginner.tools = ["Shopify", "Wix eCommerce", "Gumroad"];
    learningPath.intermediate.tools = ["MedusaJS", "Stripe API", "Next.js Commerce"];
    learningPath.advanced.tools = ["Saleor", "Magento", "Custom Microservices"];
    learningPath.beginner.hints = "Use existing templates to launch your store in days.";
    learningPath.intermediate.hints = "Implement custom checkout flows and integrate payment gateways securely.";
  } else if (lowerIdea.includes('social')) {
    learningPath.beginner.tools = ["Adalo", "Thunkable"];
    learningPath.intermediate.tools = ["Stream.io", "Socket.io", "Firebase Realtime DB"];
    learningPath.advanced.tools = ["Apache Kafka", "Neo4j (Graph DB)", "Cassandra"];
    learningPath.intermediate.hints = "Use WebSocket for real-time chat and notifications.";
  }

  // Refined Documentation
  const documentation = {
    executiveSummary: `This project, "${title}", aims to build a ${isMobile ? 'mobile-first' : 'web-based'} ${formData.idea.split(' ').slice(0, 5).join(' ')}... solution. The primary goal is to address the needs of ${formData.persona || 'users'} by providing a seamless, intuitive interface for ${lowerIdea.includes('shop') ? 'browsing and purchasing products' : lowerIdea.includes('social') ? 'connecting and sharing content' : 'managing data and workflows'}.`,

    systemArchitecture: `The system follows a modern ${isMobile ? 'client-server' : 'single-page application (SPA)'} architecture.
    - **Frontend**: Built with ${isMobile ? 'React Native' : 'React and Vite'}, focusing on component reusability and responsive design. State management handles user sessions and data caching.
    - **Backend**: A RESTful API powered by ${formData.constraints?.toLowerCase().includes('python') ? 'Python (FastAPI/Django)' : 'Node.js (Express)'} serves data to the client. It handles business logic, authentication, and database interactions.
    - **Database**: ${lowerIdea.includes('shop') ? 'Relational data (PostgreSQL) is used to ensure ACID compliance for transactions.' : 'A robust relational database (PostgreSQL) stores structured user and content data.'}
    - **Infrastructure**: Hosted on cloud providers (e.g., AWS, Vercel) with CI/CD pipelines for automated testing and deployment.`,

    developmentRoadmap: [
      { phase: "Phase 1: Foundation", steps: ["Set up version control (Git)", "Initialize project structure", "Configure linting and formatting", "Set up database instance"] },
      { phase: "Phase 2: Core Features", steps: ["Implement User Authentication (Signup/Login)", `Build ${mainFeature} data models`, "Create API endpoints for core CRUD operations", "Develop frontend views for main flows"] },
      { phase: "Phase 3: Polish & UI", steps: ["Apply design system and theming", "Add loading states and error handling", "Implement responsive layouts", "Add micro-interactions and animations"] },
      { phase: "Phase 4: Launch Prep", steps: ["Conduct User Acceptance Testing (UAT)", "Optimize performance (image compression, code splitting)", "Set up monitoring (Sentry, Analytics)", "Final deployment to production"] }
    ],

    testingStrategy: `A multi-layered testing approach ensures reliability:
    1. **Unit Testing**: Jest/Vitest for testing individual functions and components in isolation.
    2. **Integration Testing**: Testing API endpoints and database interactions to ensure modules work together.
    3. **E2E Testing**: Cypress/Playwright to simulate real user scenarios (e.g., "User logs in and ${lowerIdea.includes('shop') ? 'buys an item' : 'creates a post'}").`,

    deploymentGuide: `1. **Build**: Run the production build script to generate optimized assets.
    2. **Environment**: Configure environment variables (API keys, DB URLs) in the production environment.
    3. **Deploy**: Push code to the main branch to trigger the CI/CD pipeline.
    4. **Verify**: Perform a smoke test on the live URL to confirm critical paths are functional.`
  };

  return {
    concept: {
      title: title,
      description: formData.idea,
    },
    wireframeData,
    erDiagramString,
    algorithms,
    projectPhases,
    documentation,
    techSpec: {
      frontend: isMobile ? "React Native, Expo, NativeWind" : "React, Vite, Tailwind CSS, Framer Motion",
      backend: formData.constraints?.toLowerCase().includes('python') ? "Python, Django/FastAPI" : "Node.js, Express",
      database: "PostgreSQL (Supabase or Neon)",
      auth: "JWT-based authentication with OAuth providers. Secure session management.",
      dataModel: `
User {
  id: UUID
  email: String
  password_hash: String
  created_at: Timestamp
}

${dataModelEntities.join('\n\n')}
      `,
      learningPath
    },
    milestones: [
      { title: "Project Setup", description: "Initialize repo, setup DB, implement auth.", duration: "2 Days", complexity: "Medium" },
      { title: "Core Logic", description: "Implement main business logic and API.", duration: "1 Week", complexity: "High" },
      { title: "UI Implementation", description: "Build out the wireframed screens.", duration: "4 Days", complexity: "Medium" },
      { title: "Polish & Launch", description: "Testing, bug fixes, and deployment.", duration: "3 Days", complexity: "Medium" },
    ],
    research: {
      queries: [`${formData.idea} features`, "best app design patterns"],
      sources: ["https://example.com/source1", "https://example.com/source2"],
      titles: ["Example Tech Blog", "Design Trends 2025"]
    },
    workshop: getSmartWorkshopData(formData.idea),
    realWorldSamples: getSmartRealWorldSamples(formData.idea),
    uiSuggestions: [
      { searchQuery: `${ideaText} UI design modern`, description: `A sleek, modern interface concept for ${ideaText}` },
      { searchQuery: `${ideaText} dashboard layout`, description: `A clear and organized dashboard layout for ${ideaText}` }
    ],
    relevantTabs: [
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
    isMock: true
  };
};

const getSmartWorkshopData = (idea) => {
  const lowerIdea = idea.toLowerCase();

  // Define content templates for different domains
  const templates = {
    legal: {
      keywords: ['legal', 'law', 'lawyer', 'attorney', 'justice', 'court'],
      data: {
        ideaOverview: `An AI-powered legal assistant designed to democratize access to legal information and streamline ${idea}.`,
        researchSummary: "Legal tech is booming, with individuals seeking affordable alternatives to traditional representation. Key trends include automated document review and chatbots.",
        existingSolutions: ["Traditional Law Firms: Expensive and slow.", "DIY Legal Forms: Lack guidance and personalization."],
        prosAndCons: [
          "Pro: High cost savings for users.", "Pro: 24/7 availability for legal questions.",
          "Con: Liability risks for incorrect advice.", "Con: Complex regulatory compliance."
        ],
        gapsAndOpportunities: [
          "Gap: Lack of jurisdiction-specific advice in current AI tools.",
          "Opportunity: Integrate with local court APIs for real-time filing."
        ],
        bestPractices: ["Ensure clear disclaimers that this is not legal advice.", "Use bank-grade encryption for sensitive documents."],
        actionPlan: ["Step 1: Consult with legal experts to define boundaries.", "Step 2: Build a database of common legal queries.", "Step 3: Launch beta with disclaimer barriers."],
        finalRecommendation: "Prioritize accuracy and compliance. Start with a niche (e.g., parking tickets or rental disputes) before expanding."
      }
    },
    health: {
      keywords: ['health', 'doctor', 'med', 'fitness', 'workout', 'gym', 'diet'],
      data: {
        ideaOverview: `A comprehensive health platform focused on ${idea} to improve user wellness and tracking.`,
        researchSummary: "Digital health adoption is at an all-time high. Users demand personalized plans and seamless integration with wearable devices.",
        existingSolutions: ["General Fitness Apps: Good for tracking but lack specific coaching.", "Medical Portals: Secure but user experience is often poor."],
        prosAndCons: [
          "Pro: Increasing health consciousness drives demand.", "Pro: High user retention if habit-forming.",
          "Con: Strict data privacy (HIPAA/GDPR) requirements.", "Con: Saturation in the general fitness market."
        ],
        gapsAndOpportunities: [
          "Gap: Disconnect between fitness data and medical records.",
          "Opportunity: Use AI to predict health trends based on wearable data."
        ],
        bestPractices: ["Prioritize user data privacy and consent.", "Focus on positive reinforcement and gamification."],
        actionPlan: ["Step 1: Prototype the core tracking interface.", "Step 2: Integrate with Apple Health/Google Fit APIs.", "Step 3: Partner with certified trainers for content."],
        finalRecommendation: "Build trust through transparency. Focus on a specific niche (e.g., post-natal recovery or senior fitness) to stand out."
      }
    },
    finance: {
      keywords: ['finance', 'money', 'bank', 'invest', 'crypto', 'wallet', 'budget'],
      data: {
        ideaOverview: `A secure financial tool specifically designed for ${idea}, aiming to simplify wealth management.`,
        researchSummary: "Fintech users are looking for automation and education. There is a shift towards passive investing and AI-driven budgeting advice.",
        existingSolutions: ["Traditional Banking Apps: Clunky and reactive.", "Robo-advisors: Good for investing but lack holistic planning."],
        prosAndCons: [
          "Pro: High customer lifetime value.", "Pro: sticky ecosystem once users connect accounts.",
          "Con: extremely high security and compliance barrier.", "Con: Trust is hard to gain and easy to lose."
        ],
        gapsAndOpportunities: [
          "Gap: Financial literacy tools for younger demographics.",
          "Opportunity: Gamify savings goals with social accountability."
        ],
        bestPractices: ["Implement 2-Factor Authentication by default.", "Provide clear visualizations of complex data."],
        actionPlan: ["Step 1: Secure necessary API access (Plaid/Yodlee).", "Step 2: Develop a secure, read-only dashboard MVP.", "Step 3: Launch with limited users to test security."],
        finalRecommendation: "Security is your feature #1.  Focus on explaining 'why' behind financial data, not just showing numbers."
      }
    },
    education: {
      keywords: ['education', 'learn', 'teach', 'school', 'tutor', 'course', 'study'],
      data: {
        ideaOverview: `An interactive learning platform for ${idea} that adapts to student needs.`,
        researchSummary: "EdTech is moving towards micro-learning and adaptive paths. Students prefer bite-sized content and mobile-first experiences.",
        existingSolutions: ["MOOCs: Great content but low completion rates.", "Flashcard Epps: Good for memorization but lack depth."],
        prosAndCons: [
          "Pro: Global market with diverse needs.", "Pro: High social impact potential.",
          "Con: Long sales cycles if targeting schools.", "Con: Difficulty in keeping users engaged long-term."
        ],
        gapsAndOpportunities: [
          "Gap: Real-time feedback on subjective topics (like essays).",
          "Opportunity: Peer-to-peer learning networks."
        ],
        bestPractices: ["Use spaced repetition algorithms.", "Keep lessons under 5 minutes."],
        actionPlan: ["Step 1: Create a curriculum content map.", "Step 2: Build a simple quiz engine.", "Step 3: Test with a small student cohort."],
        finalRecommendation: "Content is king, but engagement is queen. Focus on making the learning process addictive."
      }
    },
    social: {
      keywords: ['social', 'connect', 'chat', 'message', 'media', 'network', 'dating'],
      data: {
        ideaOverview: `A next-gen social network for ${idea} focused on meaningful connections.`,
        researchSummary: "Users are fatigued by algorithmic feeds and ad-heavy platforms. There is a desire for smaller, private, interest-based communities.",
        existingSolutions: ["Major Social Networks: Too broad and noisy.", "Niche Forums: Outdated UI (like Reddit/Discord)."],
        prosAndCons: [
          "Pro: Powerful network effects if successful.", "Pro: User-generated content scales fast.",
          "Con: The 'Cold Start' problem is very hard.", "Con: Content moderation is a massive challenge."
        ],
        gapsAndOpportunities: [
          "Gap: A safe space for authentic, non-curated sharing.",
          "Opportunity: Paid membership communities for high-quality interactions."
        ],
        bestPractices: ["seed the community with manual content first.", "Focus on safety tools from day one."],
        actionPlan: ["Step 1: Launch a waitlist to gauge interest.", "Step 2: Onboard the first 100 'super users' manually.", "Step 3: Iterate features based on their feedback."],
        finalRecommendation: "Don't try to be Facebook. Be the best place for [Target Audience] to hang out."
      }
    },
    shop: {
      keywords: ['shop', 'store', 'commerce', 'buy', 'sell', 'marketplace'],
      data: {
        ideaOverview: `A specialized marketplace for ${idea} designed to streamline transactions.`,
        researchSummary: "E-commerce is prioritizing speed and trust. Social commerce and video shopping are emerging trends.",
        existingSolutions: ["General Marketplaces: High fees and competition.", "Direct-to-Consumer Sites: Hard to find customers."],
        prosAndCons: [
          "Pro: Clear monetization model (fees/commission).", "Pro: High demand for niche goods.",
          "Con: Chicken-and-egg problem (buyers vs sellers).", "Con: Logistics and returns management."
        ],
        gapsAndOpportunities: [
          "Gap: Verified tailored marketplaces for expensive goods.",
          "Opportunity: Integrate augmented reality for product previews."
        ],
        bestPractices: ["High-quality imagery is non-negotiable.", "Smooth, one-click checkout process."],
        actionPlan: ["Step 1: Recruit 10 high-quality sellers.", "Step 2: Build the buyer storefront.", "Step 3: Run targeted ads to drive initial sales."],
        finalRecommendation: "Focus on the supply side first. If you have great products, buyers will come."
      }
    }
  };

  const match = Object.values(templates).find(t => t.keywords.some(k => lowerIdea.includes(k)));
  if (match) return match.data;

  // Generic Fallback
  return {
    ideaOverview: `Innovative concept for ${idea}, aiming to solve core user pain points in the domain.`,
    researchSummary: "Initial analysis suggests a growing market interest. Users are looking for modern, efficient, and user-friendly solutions.",
    existingSolutions: ["Manual Processes: Slow and error-prone.", "Legacy Software: Expensive and hard to use."],
    prosAndCons: [
      "Pro: Solves a clear efficiency problem.", "Pro: Modern tech stack allows for faster iteration.",
      "Con: Adoption inertia from users.", "Con: Requires behavior change."
    ],
    gapsAndOpportunities: [
      "Gap: Modern UX in this specific vertical.",
      "Opportunity: AI automation of repetitive tasks."
    ],
    bestPractices: ["Start with a 'Concierge MVP' (manual backend).", "Talk to 5 users every week."],
    actionPlan: ["Step 1: Define the core value proposition.", "Step 2: Build a landing page to test demand.", "Step 3: Develop the Minimum Viable Product."],
    finalRecommendation: "Validate the problem before writing code. Ensure you are solving a 'Hair on Fire' problem."
  };
};

const getSmartRealWorldSamples = (idea) => {
  const lowerIdea = idea.toLowerCase();

  const categories = [
    {
      keywords: ['garden', 'plant', 'farm', 'flower', 'botany'],
      samples: [
        { name: "Click & Grow", url: "https://clickandgrow.com", description: "Smart indoor gardens with automated watering." },
        { name: "Gardena", url: "https://www.gardena.com", description: "Smart garden irrigation systems." },
        { name: "Rachio", url: "https://rachio.com", description: "Smart sprinkler application." }
      ]
    },
    {
      keywords: ['legal', 'law', 'lawyer', 'attorney', 'justice'],
      samples: [
        { name: "LegalZoom", url: "https://www.legalzoom.com", description: "Online legal technology company." },
        { name: "DoNotPay", url: "https://donotpay.com", description: "The world's first robot lawyer." },
        { name: "Rocket Lawyer", url: "https://www.rocketlawyer.com", description: "Online legal services provider." }
      ]
    },
    {
      keywords: ['health', 'doctor', 'med', 'fitness', 'workout', 'gym'],
      samples: [
        { name: "WebMD", url: "https://www.webmd.com", description: "Health information and news." },
        { name: "MyFitnessPal", url: "https://www.myfitnesspal.com", description: "Calorie counter and diet tracker." },
        { name: "Fitbit", url: "https://www.fitbit.com", description: "Activity trackers and wearable technology." }
      ]
    },
    {
      keywords: ['finance', 'money', 'bank', 'invest', 'crypto', 'wallet'],
      samples: [
        { name: "Mint", url: "https://mint.intuit.com", description: "Personal financial management website." },
        { name: "Robinhood", url: "https://robinhood.com", description: "Commission-free stock trading." },
        { name: "Coinbase", url: "https://www.coinbase.com", description: "Secure platform to buy and sell crypto." }
      ]
    },
    {
      keywords: ['education', 'learn', 'teach', 'school', 'tutor', 'course'],
      samples: [
        { name: "Duolingo", url: "https://www.duolingo.com", description: "Language-learning website and app." },
        { name: "Khan Academy", url: "https://www.khanacademy.org", description: "Free online courses and lessons." },
        { name: "Coursera", url: "https://www.coursera.org", description: "Online courses from top universities." }
      ]
    },
    {
      keywords: ['shop', 'store', 'commerce', 'buy', 'sell', 'market'],
      samples: [
        { name: "Shopify", url: "https://www.shopify.com", description: "E-commerce platform for online stores." },
        { name: "Amazon", url: "https://www.amazon.com", description: "Global integrated marketplace." },
        { name: "Etsy", url: "https://www.etsy.com", description: "E-commerce focused on handmade items." }
      ]
    },
    {
      keywords: ['travel', 'trip', 'flight', 'hotel', 'booking', 'vacation'],
      samples: [
        { name: "Airbnb", url: "https://www.airbnb.com", description: "Vacation rentals and experiences." },
        { name: "TripAdvisor", url: "https://www.tripadvisor.com", description: "Travel guidance and reviews." },
        { name: "Booking.com", url: "https://www.booking.com", description: "Online travel agency for lodging." }
      ]
    },
    {
      keywords: ['social', 'connect', 'chat', 'message', 'media', 'network'],
      samples: [
        { name: "Instagram", url: "https://www.instagram.com", description: "Photo and video sharing social networking." },
        { name: "TikTok", url: "https://www.tiktok.com", description: "Short-form video hosting service." },
        { name: "LinkedIn", url: "https://www.linkedin.com", description: "Professional networking platform." }
      ]
    },
    {
      keywords: ['work', 'task', 'project', 'team', 'productivity'],
      samples: [
        { name: "Notion", url: "https://www.notion.so", description: "All-in-one workspace for notes and tasks." },
        { name: "Trello", url: "https://trello.com", description: "Visual tool for organizing work." },
        { name: "Slack", url: "https://slack.com", description: "Messaging program for teams." }
      ]
    },
    {
      keywords: ['food', 'cook', 'recipe', 'eat', 'delivery', 'restaurant'],
      samples: [
        { name: "Yelp", url: "https://www.yelp.com", description: "Crowd-sourced reviews about businesses." },
        { name: "Uber Eats", url: "https://www.ubereats.com", description: "Online food ordering and delivery." },
        { name: "AllRecipes", url: "https://www.allrecipes.com", description: "Food-focused social network." }
      ]
    },
    {
      keywords: ['house', 'home', 'estate', 'rent', 'property'],
      samples: [
        { name: "Zillow", url: "https://www.zillow.com", description: "Real estate marketplace." },
        { name: "Redfin", url: "https://www.redfin.com", description: "Full-service real estate brokerage." },
        { name: "Realtor.com", url: "https://www.realtor.com", description: "Real estate listings and data." }
      ]
    },
    {
      keywords: ['music', 'video', 'movie', 'stream', 'entertainment'],
      samples: [
        { name: "Spotify", url: "https://www.spotify.com", description: "Digital music service." },
        { name: "Netflix", url: "https://www.netflix.com", description: "Streaming service for movies and TV." },
        { name: "YouTube", url: "https://www.youtube.com", description: "Online video sharing and social media." }
      ]
    },
    {
      keywords: ['service', 'gig', 'hiring', 'job', 'freelance'],
      samples: [
        { name: "Upwork", url: "https://www.upwork.com", description: "Freelancing marketplace." },
        { name: "Fiverr", url: "https://www.fiverr.com", description: "Freelance services for business." },
        { name: "TaskRabbit", url: "https://www.taskrabbit.com", description: "Same-day service platform." }
      ]
    },
    {
      keywords: ['resume', 'cv', 'portfolio', 'job', 'career'],
      samples: [
        { name: "Zety", url: "https://zety.com", description: "Professional resume builder and checks." },
        { name: "Novoresume", url: "https://novoresume.com", description: "Resume builder for modern job seekers." },
        { name: "Canva Resumes", url: "https://www.canva.com/resumes", description: "Creative resume templates and design." }
      ]
    },
    {
      keywords: ['ai', 'gpt', 'bot', 'intelligence', 'smart'],
      samples: [
        { name: "OpenAI", url: "https://openai.com", description: "AI research and deployment company." },
        { name: "Jasper", url: "https://www.jasper.ai", description: "AI content generator for marketing." },
        { name: "Midjourney", url: "https://www.midjourney.com", description: "Generative artificial intelligence program." }
      ]
    }
  ];

  const match = categories.find(cat => cat.keywords.some(k => lowerIdea.includes(k)));
  if (match) return match.samples;

  // Fallback: ProductHunt Search (More strictly "product" related than Google)
  return [
    { name: "Product Hunt Search", url: `https://www.producthunt.com/search?q=${encodeURIComponent(idea)}`, description: `Browse existing "${idea}" products on Product Hunt.` },
    { name: "TechCrunch News", url: `https://search.techcrunch.com/search?p=${encodeURIComponent(idea)}`, description: `Latest tech news regarding ${idea}.` },
    { name: "Kickstarter Projects", url: `https://www.kickstarter.com/discover/advanced?term=${encodeURIComponent(idea)}`, description: `Crowdfunded projects related to ${idea}.` }
  ];
}



function App() {
  const [loading, setLoading] = useState(true);
  const [generatedData, setGeneratedData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
    const savedUser = localStorage.getItem('user-data') || localStorage.getItem('user');

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') {
          setUser(parsed);

          // Silently sync to backend to ensure user is in DB for Admin Dashboard
          fetch("http://localhost:8080/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: parsed.email, name: parsed.name }),
          }).then(res => res.json()).then(data => {
            if (data && data.user && !parsed._id) {
              const updatedUser = { ...parsed, _id: data.user._id };
              setUser(updatedUser);
              localStorage.setItem("user-data", JSON.stringify(updatedUser));
            }
          }).catch(() => { });
        }
      } catch (e) {
        console.error("Session recovery failed", e);
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    // Simulate initial app load
    const timer = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleAuthSuccess = (data) => {
    localStorage.setItem('auth-token', data.token);
    localStorage.setItem('user-data', JSON.stringify(data.user));
    setUser(data.user);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    setUser(null);
    navigate('/');
  };

  const handleGenerate = async (formData) => {
    setIsGenerating(true);

    // Save activity to MongoDB backend
    try {
      fetch("http://localhost:8080/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityType: 'describe_idea', prompt: formData.idea })
      }).catch(e => console.error("Failed to save activity", e));
    } catch (e) {
      console.error("Error saving activity:", e);
    }

    try {
      const data = await generateProjectData(formData);
      saveToHistory(data);
      setGeneratedData(data);
      navigate('/workspace');
    } catch (error) {
      console.error("Gemini Generation failed:", error);

      // Fallback to mock data
      console.log("Falling back to mock data generation...");
      alert("AI Generation failed or timed out. Falling back to offline generic mock data. Please try again or check your API key limit.");
      const mockData = generateMockData(formData);
      saveToHistory(mockData);
      setGeneratedData(mockData);
      navigate('/workspace');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToHistory = (data) => {
    try {
      const historyStr = localStorage.getItem('workspace_history');
      let history = historyStr ? JSON.parse(historyStr) : [];
      // Remove same project name if it exists to replace it, and put the new one at the front
      history = [data, ...history.filter(h => h.concept?.title !== data.concept?.title)].slice(0, 5);
      localStorage.setItem('workspace_history', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const handleReopen = (data) => {
    setGeneratedData(data);
    navigate('/workspace');
  };

  const ProtectedRoute = ({ children }) => {
    if (!user && !loading) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      <AnimatePresence>
        {loading && <PageLoader />}
      </AnimatePresence>

      {!loading && (
        <Routes>
          <Route path="/" element={
            <Layout>
              <HeroSection user={user} onLogout={handleLogout} />
              <FeaturesSection />
              <ImageGenerationSection />
              <ScrollingBanner />
              <ProcessSection />
              <Footer />
            </Layout>
          } />

          <Route path="/login" element={
            <Login
              onLogin={handleAuthSuccess}
              onNavigateToRegister={() => navigate('/register')}
            />
          } />

          <Route path="/register" element={
            <Register
              onRegister={handleAuthSuccess}
              onNavigateToLogin={() => navigate('/login')}
            />
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } />

          <Route path="/about" element={<Layout><AboutUs /></Layout>} />
          <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
          <Route path="/help" element={<Layout><HelpCenter /></Layout>} />
          <Route path="/docs" element={<Layout><Documentation /></Layout>} />
          <Route path="/api" element={<Layout><APIReference /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />
          <Route path="/diagram-maker" element={<Layout><DiagramMaker /></Layout>} />
          <Route path="/code-generator" element={<CodeGenerator />} />
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/form" element={
            <ProtectedRoute>
              {isGenerating ? (
                <div className="h-screen flex items-center justify-center bg-[#050505] relative">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-highlight border-t-transparent rounded-full animate-spin mx-auto" />
                    <h3 className="text-xl font-bold text-white animate-pulse">Generating your wireframe...</h3>
                    <p className="text-gray-400">Analyzing requirements and building architecture</p>
                  </div>
                </div>
              ) : (
                <IdeaForm onGenerate={handleGenerate} onBack={() => navigate('/')} onReopen={handleReopen} />
              )}
            </ProtectedRoute>
          } />

          <Route path="/workspace" element={
            <ProtectedRoute>
              {generatedData ? (
                <Workspace
                  data={generatedData}
                  onRegenerate={() => navigate('/form')}
                  onHome={() => navigate('/')}
                />
              ) : (
                <Navigate to="/form" replace />
              )}
            </ProtectedRoute>
          } />
        </Routes>
      )}
    </>
  );
}

export default App;
