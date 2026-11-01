# 🤖 AI Resume Job Matcher

An AI-powered web application that analyzes resumes against job descriptions to help candidates understand their suitability for a particular job role, identify skill gaps, and improve their chances of getting hired.

## 📌 Project Overview

**AI Resume Job Matcher** is an intelligent resume analysis and job-matching platform that uses Artificial Intelligence to compare a candidate's resume with a given job description.

The system analyzes the candidate's skills, calculates a job match score, identifies missing skills, recommends suitable job roles, and provides a personalized learning roadmap to improve employability.

The main objective is to make the job application process smarter, easier, and more efficient.

## 🎯 Objectives

- Automate resume analysis using AI.
- Match candidate profiles with job descriptions.
- Calculate resume-to-job compatibility scores.
- Identify missing and matching skills.
- Recommend suitable job opportunities.
- Generate personalized skill improvement roadmaps.
- Help candidates make better career decisions.

## ✨ Key Features

### 1. Resume Upload
- Upload resumes in PDF and TXT formats.
- Extract relevant information from uploaded resumes.
- Analyze candidate skills and qualifications.

### 2. AI-Based Resume Matching
- Compare resume content with job descriptions.
- Identify matching skills.
- Calculate an overall job compatibility score.
- Highlight relevant candidate strengths.

### 3. Skill Gap Analysis
- Identify skills required by the job but missing from the resume.
- Highlight areas that need improvement.
- Help candidates understand their skill gaps.

### 4. Job Recommendations
- Recommend suitable job roles based on candidate skills.
- Help candidates explore relevant career opportunities.

### 5. Personalized Learning Roadmap
- Suggest skills that candidates should learn.
- Provide guidance for improving job readiness.
- Help candidates prepare for their target roles.

### 6. AI Integration
- Google Gemini API integration for AI-powered analysis.
- Intelligent suggestions and personalized feedback.
- Demo functionality available without API credentials.

### 7. Interactive Dashboard
- Modern and user-friendly interface.
- Visual representation of resume analysis.
- Easy navigation and interactive results.

### 8. Report Generation
- Download resume analysis reports.
- Review matching results and skill gaps.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| JavaScript | Application functionality |
| Node.js | Backend runtime |
| Express.js | Backend API |
| Google Gemini API | AI-powered analysis |
| MongoDB | Optional database integration |
| HTML & CSS | Interface design |
| Git & GitHub | Version control |

## 🏗️ Project Architecture

The project follows a frontend-backend architecture.

1. **Frontend:** React-based interactive dashboard.
2. **Backend:** Node.js and Express.js handle application requests.
3. **AI Layer:** Gemini API provides AI-powered analysis when configured.
4. **Database Layer:** MongoDB integration scaffold for future persistent data storage.

## 📂 Project Structure

```text
ai-resume-job-matcher/
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── package.json
│   └── server.js
│
├── package.json
├── README.md
└── .gitignore
```

## ⚙️ Installation and Setup

Follow these steps to run the project locally.

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Open the Project Folder

```bash
cd ai-resume-job-matcher
```

### Step 3: Install Dependencies

```bash
npm install
npm run install:all
```

### Step 4: Configure Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
MONGODB_URI=your_mongodb_connection_string
```

Gemini API and MongoDB credentials are optional for the basic demo. Configure them to enable the corresponding integrations.

### Step 5: Start the Application

From the root project directory, run:

```bash
npm run dev
```

The frontend and backend development servers will start.

Open the local frontend URL displayed in your terminal.

## 🔄 How It Works

1. User uploads their resume.
2. User enters the target job description.
3. The system analyzes the resume.
4. Resume skills are compared with job requirements.
5. A compatibility score is generated.
6. Matching and missing skills are identified.
7. Relevant job recommendations are displayed.
8. A personalized learning roadmap is generated.
9. User can download the analysis report.

## 🚀 Future Enhancements

- LinkedIn profile integration.
- Multiple job description comparison.
- Advanced semantic resume matching.
- ATS compatibility analysis.
- Resume improvement suggestions.
- Interview preparation recommendations.
- User authentication and profile management.
- Persistent analysis history using MongoDB.
- Real-time job recommendations.

## 🎓 Project Information

**Project Title:** AI-Based Resume-to-Job Description Matching System

**Project Type:** Artificial Intelligence / Web Development

**Project Domain:** AI and Career Guidance

**Development Approach:** Web-Based Application

**Team Size:** 10 Members

**Purpose:** Academic Project

## 👩‍💻 Contributors

This project is developed collaboratively by a team of 10 members.

Each team member contributes to different areas, including frontend development, backend development, AI integration, testing, research, documentation, and presentation.

## 📌 Conclusion

The AI Resume Job Matcher aims to simplify the job application process by using Artificial Intelligence to evaluate resumes and match candidates with suitable job opportunities.

It helps candidates understand their strengths, identify missing skills, and receive actionable recommendations to improve their career prospects.

---

⭐ **If you find this project interesting, don't forget to star the repository!**
