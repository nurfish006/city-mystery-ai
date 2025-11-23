GitHub README & Project Documentation
🎯 City Mystery AI Explorer - Complete Project Overview
🌍 City Mystery AI Explorer
A modern, gamified web application that challenges players to guess hidden cities through cryptic clues, progressive map reveals, and AI-powered puzzles. Explore world geography and Ethiopian cultural heritage in an engaging, educational experience.

https://img.shields.io/badge/Game-Geography%2520Puzzle-blue
https://img.shields.io/badge/Next.js-14-black
https://img.shields.io/badge/TypeScript-5.0-blue
https://img.shields.io/badge/AI-OpenAI-green

✨ Features
🎮 Core Gameplay
Progressive Clue System: 4 increasingly specific clues per city with strategic scoring

Interactive Maps: Leaflet.js maps with blur reveal mechanics

Smart Validation: Close-match detection with helpful feedback

Multiple Difficulties: Easy, Medium, Hard with balanced challenges

🤖 Intelligent Systems
AI-Powered Clues: OpenAI GPT integration for dynamic, creative clues

Offline Fallback: Robust JSON-based system when AI is unavailable

Smart Detection: Automatic AI availability checking and mode switching

🌍 Cultural Modes
World Mode: General geographical and landmark-based clues

Ethiopia Legend Mode: Deep cultural, historical, and mythological content

Educational Focus: Learn about Ethiopian heritage and world geography

🏆 Engagement Features
City Cards Collectibles: Unlock virtual cards with city information

Leaderboard System: Compete with players globally

Progressive Scoring: Points degrade strategically with clues used

Game History: Track your progress and achievements

🛠️ Technology Stack
Framework: Next.js 14 with App Router

Language: TypeScript for type safety

Styling: Tailwind CSS + shadcn/ui components

State Management: Zustand for client state

Database: Supabase (PostgreSQL)

Maps: Leaflet.js with OpenStreetMap

AI: OpenAI GPT-3.5/4 integration

Deployment: Vercel

Authentication: Supabase Auth

📁 Project Structure
text
city-mystery-ai/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── play/              # Game interface
│   ├── leaderboard/       # Competition page
│   ├── profile/           # User profile
│   └── api/               # API routes
├── components/
│   ├── game/              # Game components
│   ├── monetization/      # Premium features
│   └── layout/            # UI components
├── lib/
│   ├── ai/                # AI clue generation
│   ├── game/              # Game engine & logic
│   └── utils/             # Utilities
├── store/                 # Zustand state management
├── data/                  # Static data files
├── hooks/                 # Custom React hooks
└── public/                # Static assets
🚀 Quick Start
Prerequisites
Node.js 18+

npm or yarn

OpenAI API key (optional)

Supabase account (free tier)

Installation
Clone the repository

bash
git clone https://github.com/your-username/city-mystery-ai.git
cd city-mystery-ai
Install dependencies

bash
npm install
Environment setup

bash
cp .env.local.example .env.local
Edit .env.local with your keys:

env
# OpenAI (optional)
OPENAI_API_KEY=sk-your-key-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
Run development server

bash
npm run dev
Visit http://localhost:3000

🎮 How to Play
Start a Game: Choose difficulty (Easy, Medium, Hard) and mode (World or Ethiopia)

Receive Clues: Get progressively clearer clues about a hidden city

Use Maps: Watch the interactive map reveal details with each clue

Make Guesses: Submit city names with smart validation

Earn Points: Score degrades with clues used - guess early for max points!

Collect Cards: Unlock city cards with historical information

Compete: Climb the leaderboard and track your progress

🧩 Game Modes
🌐 World Mode
Random cities from around the world

Geographical and landmark-based clues

Standard scoring system

🇪🇹 Ethiopia Legend Mode
Ethiopian cities and historical sites

Cultural, mythological, and historical clues

Enhanced educational content

Unique scoring bonuses

🤖 AI Integration
The game features a hybrid AI system:

Primary: OpenAI GPT generates dynamic, creative clues

Fallback: JSON-based offline system ensures 100% uptime

Smart Detection: Automatic mode switching based on API availability