# AI Interview Assistant

## Overview
This is an AI-powered interview chatbot built with Next.js, Tailwind CSS, and Google Gemini AI. The application simulates an interview process for various job roles.

## Features
- Dynamic AI-driven interview simulation
- Job-specific interview questions
- Real-time chat interface
- UUID-based chat session management

## Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Google Gemini API Key

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the project root and add your Gemini API key:
```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

## Running the Application

- Development mode:
```bash
npm run dev
```

- Production build:
```bash
npm run build
npm start
```

## Environment Variables
- `GEMINI_API_KEY`: Required for Google Gemini AI integration

## Technologies
- Next.js 15
- React 19
- Tailwind CSS
- Google Generative AI
- TypeScript

## License
[Your License Here]
