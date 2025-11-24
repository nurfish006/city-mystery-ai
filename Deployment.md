Deployment Guide
Vercel Deployment
Prepare your repository

bash
git add .
git commit -m "Ready for deployment"
git push origin main
Deploy to Vercel

Go to vercel.com

Sign in with GitHub

Click "New Project"

Import your repository

Configure environment variables in Vercel dashboard

Environment Variables in Vercel
Add these in your project settings:

OPENAI_API_KEY (optional)

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

Deploy

Vercel will automatically deploy on git push

Your app will be available at https://your-project.vercel.app

Supabase Setup
Create Supabase Project

Go to supabase.com

Create new project

Get URL and anon key from Settings > API

Database Schema
Run this SQL in the Supabase SQL editor:

sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE,
  premium_tier BOOLEAN DEFAULT false,
  premium_since TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Games table
CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  city_name VARCHAR(100),
  mode VARCHAR(20),
  difficulty VARCHAR(20),
  score INTEGER,
  attempts INTEGER,
  clues_used INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboard view
CREATE VIEW leaderboard AS
SELECT 
  u.username,
  COUNT(g.id) as games_played,
  SUM(g.score) as total_points,
  AVG(g.score) as avg_score
FROM users u
LEFT JOIN games g ON u.id = g.user_id
GROUP BY u.id, u.username
ORDER BY total_points DESC;