# TutorScreen | Pedagogy Elite MVP Documentation

## 1. Project Overview
TutorScreen is a high-fidelity AI-driven pedagogical assessment and interview training platform. It is designed to evaluate and train educators and professionals across various industries using hyper-realistic voice and text simulations. The platform provides surgical, recruiter-ready feedback based on industry benchmarks.

---

## 2. Core Architecture & Technology Stack
*   **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS (v4).
*   **Authentication**: Firebase Authentication (Email/Password & Google OAuth).
*   **Database**: Cloud Firestore (NoSQL) for user profiles, interview logs, and feedback.
*   **Voice AI Engine**: Vapi.ai (Real-time Web RTC voice interaction).
*   **Intelligence Layer**: Google Gemini 2.0 Flash (Feedback generation and performance analysis).
*   **State Management**: React Hooks & Server Actions.

---

## 3. Key Features

### A. Advanced Authentication (Elite Protocol Onboarding)
*   **Dual-Path Auth**: Supports traditional secure email/password registration and one-click Google OAuth.
*   **Identity Synchronization**: Automatic database registration for social login users via a `syncUser` bridge.
*   **Theme-Aware UI**: Completely refactored auth pages utilizing the "Elite Protocol" aesthetic.

### B. Interview Simulation Engine
*   **Expert Roadmap (Available Tracks)**: 75+ expert-calibrated interview modules across Technology, Education, Finance, and Marketing.
*   **Custom Session Builder**: Users can define their own target role, seniority level, tech stack, and question depth (3–10 questions).
*   **Hybrid Interface**: Supports both **Voice Protocol** (Real-time speech) and **Text Overlay** (Typed interaction) within the same session.
*   **Dynamic AI Persona**: The AI interviewer dynamically adapts its tone (Coach vs. Recruiter) and expertise based on the selected track or custom configuration.

### C. Pedagogical Evaluation System (The Feedback Loop)
*   **Cinematic Hand-off**: A full-screen, blurred "Evaluating Performance" transition that visually communicates data ingestion.
*   **Metric-Driven Analysis**: Scores users on 5 key pillars:
    1.  **Clarity**: Communication effectiveness.
    2.  **Simplicity**: Ability to explain complex concepts.
    3.  **Patience**: Tone and supportiveness.
    4.  **Fluency**: Conversational flow.
    5.  **Warmth**: Professional persona.
*   **Recruiter Summary**: A high-level qualitative summary of performance.
*   **Evidence-Based Reporting**: Direct quotes from the transcript are highlighted to justify scores.

### D. User Dashboard & History (The Vault)
*   **Activity Tracking**: View last active dates and historical performance scores.
*   **Historical Analysis**: Access full transcripts and feedback for every past session.
*   **Analytics Dashboard**: Visual representation of user progress and pedagogical growth.

---

## 4. Design System (The "Elite Protocol" Aesthetic)
*   **Semantic Token System**: Robust CSS variable system (`--bg-primary`, `--card-bg`, etc.) ensuring consistent theming across all components.
*   **Default Light Mode**: Crisp, clean, SaaS-focused aesthetic for maximum readability.
*   **Elite Dark Mode**: Immersive **Pure Black (#000000)** environment with Emerald-500 (`#10B981`) accents and subtle glassmorphism.
*   **Responsive Excellence**: Fully optimized for mobile with a custom bottom navigation bar and desktop with a glass-morphic header.

---

## 5. Deployment & Stability
*   **Environment Sync**: Fully synchronized with GitHub (`main` branch).
*   **Secure Handshake**: HttpOnly cookies for session management to prevent XSS.
*   **Optimized Performance**: Turbopack-enabled development and optimized production bundles.

---

**TutorScreen is built to be the gold standard for pedagogical screening, bridging the gap between raw knowledge and communication excellence.**
