# ⚡ BILL LENS AI — Pakistani Utility Smart Expense Engine

> **AI-Powered OCR Bill Auditing, Surcharge Anomaly Detection, Tariff Optimization & Financial Health Scoring for Pakistani Households.**

[![Live Demo](https://img.shields.io/badge/Live_App-BILL_LENS_AI-0D9488?style=for-the-badge&logo=googlechrome&logoColor=white)](https://ais-pre-ivwh73oqk5qflodmx6k5fr-1064946044178.asia-southeast1.run.app)
[![Tech Stack](https://img.shields.io/badge/React_18-Vite_TypeScript-0284C7?style=for-the-badge&logo=react)](https://react.dev)
[![AI Engine](https://img.shields.io/badge/Gemini_3.6_Flash-Google_GenAI-7C3AED?style=for-the-badge&logo=googlegemini)](https://ai.google.dev)
[![Database](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Language Support](https://img.shields.io/badge/Bilingual-English_%26_Urdu_(RTL)-10B981?style=for-the-badge)](https://ais-pre-ivwh73oqk5qflodmx6k5fr-1064946044178.asia-southeast1.run.app)

---

## 🌐 Live Deployed Application

🔗 **Access the Live Production App:**  
https://bill-lenss-ai.vercel.app/

---

## 📑 Table of Contents

- [Overview & Real-World Problem](#-overview--real-world-problem)
- [Core Features & Capabilities](#-core-features--capabilities)
- [Supported Utility Providers](#-supported-utility-providers)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [AI Engine & Prompt Architecture](#-ai-engine--prompt-architecture)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Project Directory Structure](#-project-directory-structure)
- [Local Setup & Installation](#-local-setup--installation)
- [UI Screenshots & Layout Preview](#-ui-screenshots--layout-preview)
- [License & Credits](#-license--credits)

---

## 🎯 Overview & Real-World Problem
Bill Lens AI is an intelligent web application that allows users to upload utility bills or receipts and instantly receive an AI-powered explanation of the bill.

Instead of manually reading complex bills, users receive a simple breakdown of charges, important information, potential anomalies, and personalized financial insights.

The application combines **Google Gemini AI**, **Firebase Authentication**, **Cloud Firestore**, and OCR-based bill analysis to create a smart financial assistant.
### The Challenge
Pakistani households face immense difficulty understanding and tracking complex utility bills from distribution companies like **LESCO**, **K-Electric**, **SNGPL**, **SSGC**, **PTCL**, and **WASA**. 

Key consumer challenges include:
1. **Unpredictable Fuel Price Adjustments (FPA):** Retrospective charges applied months later without clear explanation.
2. **Slab Tariff Threshold Jumps:** Crossing critical boundaries (e.g. 200, 300, or 500 kWh units) causes a transition from "protected consumer" status to non-protected rates, drastically escalating unit rates.
3. **Complex Tax & Surcharge Structures:** General Sales Tax (GST), PTV Fees, Income Tax, Financing Cost (FC) Surcharges, and Extra Tax are buried in dense fine print.
4. **Language & Technical Barriers:** Utility bills use technical terminology in English, making audit difficult for non-native English speakers.

### The Solution: BILL LENS AI
**BILL LENS AI** is a specialized financial intelligence platform engineered specifically for Pakistani utility consumers. By combining **Google Gemini 3.6 Flash** multimodal computer vision with real-time tariff analytics, Bill Lens AI allows users to scan or upload utility bills, extract exact itemized breakdowns, detect hidden surcharges and anomalies, receive a 0–100 **Financial Health Score**, and access actionable energy habit optimizations in both **English and Urdu** (with native RTL support).
# 👥 Target Users
- Students
- Families
- Homeowners
- Renters
- Small business owners
- Anyone who wants to better understand their bills

---

## ✨ Core Features & Capabilities

### 📷 1. Smart Utility OCR & Bill Scanner
- **Multimodal AI Extraction:** Upload bill images (JPG, PNG, WebP) or select pre-loaded sample bills for **LESCO Electricity**, **SNGPL Sui Gas**, **PTCL Flash Fiber**, **WASA Water**, and **Postpaid Mobile**.
- **Automated Line-Item Breakdown:** AI extracts provider name, account/consumer number, bill date, due date, consumed units, current meter reading, tariff slab, base charges, and itemized surcharges.

### 🚨 2. Surcharge & Anomaly Detection Engine
- **Automated Price Spike Auditing:** Automatically flags line items experiencing rate spikes or unusual increases (e.g., +30% FPA surcharges).
- **Tariff Boundary Warnings:** Alerts users when unit consumption approaches expensive slab tariff boundaries (e.g., approaching 200 or 300 unit thresholds).

### 🇵🇰 3. Complete Bilingual Support (English & Urdu RTL)
- **Seamless Language Toggle:** Switch between English and Urdu with one tap in Profile Settings.
- **Native Right-to-Left (RTL) Layout:** Full UI layout reorientation when Urdu is selected, ensuring comfortable reading for Urdu speakers.
- **Comprehensive Translations:** All dashboards, AI insights, bill breakdown titles, search interfaces, modal dialogs, and notifications are fully localized.

### 📊 4. Financial Health Score (0–100)
- **Multi-Factor Scoring:** Evaluates tax-to-base charge ratios, tariff slab efficiency, payment timeliness, and month-over-month consumption stability.
- **Tailored Pakistani Energy Advice:** Suggests actionable habits, such as avoiding high-consumption appliances during peak hours (e.g. LESCO peak hours: 5:00 PM – 11:00 PM).

### 🔍 5. Intelligent Multi-Attribute Search & Filtering
- **Universal Smart Search:** Search bills across provider names, account numbers, amounts, due dates, line items, and AI summaries.
- **Keyword & Alias Matching:** Search for "bijli" or "بجلی" to find electricity bills, or "sui gas" / "سوئی گیس" to locate gas bills.
- **Instant Search Banner:** Dedicated search result row in front of the dashboard for quick navigation.

### 💬 6. "Ask AI About This Charge" Interactive Q&A
- **Line-Item Auditing:** Tap any specific fee (such as FPA, PTV Fee, or FC Surcharge) to ask Gemini AI for a plain-language explanation of why it was charged and how it is calculated under Pakistani regulatory guidelines.

### 📉 7. Historical Expense Analytics & Budgeting
- **6-Month Trend Visualizations:** Interactive area & bar charts (powered by Recharts) tracking category-wise monthly spending.
- **Monthly Utility Budget Limits:** Set spending caps and receive automated alerts when utility expenditure approaches budget thresholds.

### ☁️ 8. Firebase Firestore Synchronization & Offline Fallback
- **Cloud Persistence:** Automatic real-time database sync for logged-in users via Firebase Firestore.
- **Offline Resilience:** Local storage fallback ensures complete app usability and sample data exploration even without an active internet connection.

---

## 🏢 Supported Utility Providers

BILL LENS AI is calibrated for Pakistani utility distribution companies and service providers:

| Category | Supported Providers & Services |
| :--- | :--- |
| ⚡ **Electricity** | LESCO (Lahore), K-Electric (Karachi), IESCO (Islamabad), FESCO (Faisalabad), MEPCO (Multan), GEPCO (Gujranwala), PESCO (Peshawar), QESCO, HESCO, SEPCO |
| 🔥 **Sui Gas** | SNGPL (Sui Northern Gas Pipelines Ltd), SSGC (Sui Southern Gas Company) |
| 🌐 **Internet & Broadband** | PTCL Flash Fiber, StormFiber, Nayatel, Transworld, Cybernet |
| 🚰 **Water & Sanitation** | WASA (Lahore, Rawalpindi, Multan), KWSB (Karachi Water & Sewerage Board), CDA Water |
| 📱 **Mobile Postpaid** | Jazz, Zong 4G, Telenor, Ufone |
| 🏥 **Healthcare & Taxes** | Chughtai Lab, Shaukat Khanum, State Life Insurance, EFU, Excise & Property Tax |

---
# 🧠 AI Feature

Bill Lens AI uses **Google Gemini AI** to understand uploaded bills and provide natural-language explanations.

The AI performs the following tasks:

- Reads bill information
- Identifies provider
- Extracts important values
- Explains charges
- Detects unusual fees
- Suggests possible savings
- Summarizes the bill in simple language

---

# 📝 AI System Prompt

The AI assistant follows instructions similar to:

> You are an expert financial assistant specializing in utility bill analysis. Carefully analyze the uploaded bill or receipt, extract all important information including provider name, bill amount, due date, taxes, service charges, and payment details. Explain every charge in simple language. Detect any unusual or suspicious fees, identify billing anomalies, and provide practical money-saving recommendations. Respond clearly using bullet points and keep the explanation easy for non-technical users. If information is missing or unclear, state that explicitly instead of guessing.

## 🏗️ System Architecture & Data Flow

```text
  ┌───────────────────────────────────────────────────────────┐
  │                 React 18 + Vite Frontend                  │
  │     (Tailwind CSS, Lucide Icons, Recharts, i18n RTL)      │
  └──────────────┬─────────────────────────────┬──────────────┘
                 │                             │
    REST / JSON  │                             │ Real-Time Sync
  API Requests   ▼                             ▼
  ┌─────────────────────────────┐   ┌─────────────────────────┐
  │     Express Node.js         │   │   Firebase Firestore    │
  │     Backend Server          │   │   Database & Auth       │
  │    (port 3000 / API Proxy)  │   └─────────────────────────┘
  └──────────────┬──────────────┘
                 │
                 │ Google GenAI SDK (@google/genai)
                 ▼
  ┌─────────────────────────────┐
  │   Google Gemini 3.6 Flash   │
  │    Multimodal AI Engine     │
  └─────────────────────────────┘
```
# 🛠 Technologies Used

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend

- Firebase Authentication
- Cloud Firestore

## Artificial Intelligence

- Google Gemini API

## Development Tools

- Google AI Studio
- GitHub
- GitHub Desktop
- Vercel

---
---

## 🤖 AI Engine & Prompt Architecture

BILL LENS AI utilizes **Google Gemini 3.6 Flash** (`gemini-3.6-flash`) server-side via the `@google/genai` SDK to keep API keys secure and invisible to client browsers.

### System Prompt for Bill Analysis (`/api/analyze-bill`)
```text
SYSTEM: You are BillWise AI, an expert financial analyst specializing in Pakistani utility billing systems (LESCO, SNGPL, PTCL, WASA, K-Electric).
You analyze household utility bills, detect surcharges, fuel adjustments (FPA), GST taxes, and slab tariffs.

Provide your output strictly in JSON format matching this schema:
{
  "plain_summary": string,
  "line_items": [{ 
    "name": string, 
    "amount": number, 
    "type": "base_charge"|"tax"|"fee", 
    "explanation": string, 
    "isAnomaly": boolean, 
    "anomalyReason": string 
  }],
  "totals": { "subtotal": number, "taxes_and_fees": number, "total": number },
  "financial_health_score": { 
    "score": number, 
    "label": "Excellent"|"Good"|"Fair"|"Needs Attention", 
    "factors": [{ "label": string, "impact": number, "description": string }] 
  },
  "savings_suggestions": [{ 
    "title": string, 
    "detail": string, 
    "estimated_monthly_savings": number, 
    "category_relevance": string 
  }],
  "disclaimer": string
}
```

---

## 🔌 API Endpoints Reference

All API routes are served by the Express backend server on port `3000`:

| Endpoint | Method | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | — | Health check verifying server and Gemini API configuration status. |
| `/api/ocr-scan` | `POST` | `{ imageBase64, mimeType }` | Accepts base64 encoded bill image and performs multimodal OCR extraction using Gemini 3.6 Flash. |
| `/api/analyze-bill` | `POST` | `{ billData, language }` | Generates a structured financial breakdown, anomaly detection flags, health score, and localized savings tips. |
| `/api/ask-charge` | `POST` | `{ bill, chargeName, question, language }` | Answers user queries about specific line items or taxes on a bill in English or Urdu. |

---

## 📁 Project Directory Structure

```text
├── server.ts                    # Express backend server with Gemini 3.6 Flash integration
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root React component, view router, and state manager
│   ├── types.ts                 # Global TypeScript definitions for Bills, User, AI Analysis
│   ├── components/
│   │   ├── analysis/            # AI Analysis, Charge Breakdown, Health Score, & Comparison
│   │   ├── auth/                # User login & authentication views
│   │   ├── common/              # Shared modals and confirm dialogs
│   │   ├── history/             # Historical bills table & filtering view
│   │   ├── home/                # Main dashboard, search bar, & financial score ring
│   │   ├── insights/            # Recharts spend analytics & category trends
│   │   ├── layout/              # App header and responsive bottom navigation bar
│   │   ├── notifications/       # Alert list & bill due date reminders
│   │   ├── profile/             # Profile management & English/Urdu language toggle
│   │   ├── scanner/             # Camera scanner, upload drag-and-drop, & sample presets
│   │   └── settings/            # Budget limit setup & notification preferences
│   └── lib/
│       ├── currency.ts          # PKR currency formatting helper
│       ├── data.ts              # Sample Pakistani bill presets & category metadata
│       ├── firebase.ts          # Firebase app configuration & SDK initialization
│       ├── firestoreService.ts  # Firestore CRUD operations for bills & user profiles
│       ├── i18n.tsx             # Bilingual context provider (English & Urdu RTL)
│       └── search.ts            # Smart search matching algorithm for bills
├── metadata.json                # Platform metadata & app permissions
├── package.json                 # Project dependencies and build/start scripts
├── vite.config.ts               # Vite configuration with Express proxy
└── README.md                    # Project documentation
```

---

## 💻 Local Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/bill-lens-ai.git
cd bill-lens-ai
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the project root (refer to `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Step 4: Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

### Step 5: Build for Production
```bash
npm run build
npm start
```

---

## 🖼️ UI Screenshots & Layout Preview

### 1. Main Dashboard (English)
<img width="1920" height="963" alt="Screenshot 2026-07-27 202348" src="https://github.com/user-attachments/assets/ea36432d-9e07-4ea9-919d-1ffeb07738a5" />
<img width="1920" height="971" alt="Screenshot 2026-07-27 203317" src="https://github.com/user-attachments/assets/47dafea0-d67b-47e7-a581-ee5e6fe5c8b0" />

<img width="1920" height="977" alt="Screenshot 2026-07-27 203411" src="https://github.com/user-attachments/assets/1ce4f9b0-9e69-41e2-91a4-1aa15b1afc27" />
<img width="1920" height="971" alt="Screenshot 2026-07-27 203343" src="https://github.com/user-attachments/assets/795542ce-a2af-422a-95ed-918519f8f8bc" />
<img width="1920" height="957" alt="Screenshot 2026-07-27 203503" src="https://github.com/user-attachments/assets/6715b49b-7a8b-4470-8bb8-1214f7f5df28" />
<img width="1920" height="955" alt="Screenshot 2026-07-27 203436" src="https://github.com/user-attachments/assets/e0c8d331-f233-4fd2-9760-70e77e5ba24c" />

<img width="1920" height="970" alt="Screenshot 2026-07-27 203537" src="https://github.com/user-attachments/assets/73dc01ac-7905-4c9f-993f-384172274c23" />
<img width="1920" height="965" alt="Screenshot 2026-07-27 203524" src="https://github.com/user-attachments/assets/cdf2a26c-fa00-49d6-8292-982fea23ddb5" />
<img width="1920" height="971" alt="Screenshot 2026-07-27 203553" src="https://github.com/user-attachments/assets/c445fc3e-9ae5-41a3-ad4a-78f64c9199ba" />

# 💡 Challenges Faced

During development several challenges were encountered:

- Integrating Firebase Authentication
- Configuring Firestore database
- Connecting Gemini API
- Managing uploaded bill data
- Designing a clean and responsive UI
- Handling AI-generated responses efficiently

These challenges helped improve problem-solving skills and understanding of full-stack AI application development.

---

# 📚 Learning Outcomes

This project helped me learn:

- React application development
- Firebase Authentication
- Cloud Firestore
- AI integration using Gemini
- Git & GitHub workflow
- Deployment using Vercel
- Prompt engineering
- UI/UX design principles

---

# 👩‍💻 Author

**Iqra Imtiaz**

MPhil Physics Student

Lahore College for Women University (LCWU)

---

# 📄 License

This project was developed for academic and educational purposes.

---

# ⭐ Thank You

Thank you for exploring **Bill Lens AI**.

If you found this project useful, consider giving it a ⭐ on GitHub!
