# AI Resume-to-Job Description Matching System

A beginner-friendly full-stack college project with an interactive React dashboard, rule-based matching in demo mode, optional Gemini AI analysis, and an optional MongoDB connection scaffold.

## Features
- Resume upload (`.txt` and `.pdf`) and editable resume text
- Job description input and sample job descriptions
- Explainable match score and skills breakdown
- Matched, missing and additional skills
- Skill-gap recommendations and a 7-day learning roadmap
- Job-role recommendations
- Local analysis history and downloadable JSON report
- Responsive dashboard
- Optional Gemini AI analysis through the backend
- Local browser history using localStorage; optional MongoDB connection scaffold for future database expansion

## Requirements
- Node.js 20+ (Node 24 is fine)
- npm
- Optional: Gemini API key from https://aistudio.google.com/
- Optional: MongoDB Atlas connection string

## Run on Windows PowerShell
If PowerShell blocks `npm`, use `npm.cmd` in place of `npm`.

1. Extract the ZIP.
2. Open the extracted `ai-resume-job-matcher` folder in VS Code.
3. Open a terminal in the project root and run:
   ```powershell
   npm.cmd install
   npm.cmd run install:all
   ```
4. Copy `backend/.env.example` to `backend/.env`.
5. Add your Gemini key if you have one. Leave it blank to use demo mode.
6. Start both apps:
   ```powershell
   npm.cmd run dev
   ```
7. Open http://localhost:5173

Backend runs at http://localhost:5000.

## Environment variables
`backend/.env`:
- `PORT=5000`
- `GEMINI_API_KEY=` optional
- `GEMINI_MODEL=gemini-2.5-flash`
- `MONGODB_URI=` optional connection check (history is currently stored in browser localStorage)

Do not share your API key or commit `.env` to GitHub.

## How matching works
Without Gemini, the app uses a transparent keyword/skills comparison against a curated skills dictionary. The match percentage is an indicative project score, not a hiring decision or a validated ATS score. Gemini mode adds AI-generated explanations and recommendations. Always review results manually.

## Project structure
- `frontend/` React + Vite user interface
- `backend/` Express API and optional Gemini/MongoDB integration
