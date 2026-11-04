


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { GoogleGenAI } = require("@google/genai");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.0.200:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
  })
);

app.use(express.json({ limit: "2mb" }));

// Gemini AI
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

// MongoDB Schema
const analysisSchema = new mongoose.Schema(
  {
    resume: {
      type: String,
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    score: Number,
    matched: [String],
    missing: [String],
    extras: [String],
    required: [String],
    experience: Number,
    title: String,
    summary: String,

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    geminiConfigured: Boolean(ai),
    mongoConnected: mongoose.connection.readyState === 1,
  });
});

// Resume Analysis API
app.post("/api/analyze", async (req, res) => {
  const { resume, jobDescription } = req.body || {};

  if (!resume?.trim() || !jobDescription?.trim()) {
    return res.status(400).json({
      message: "Resume and job description are required.",
    });
  }

  if (!ai) {
    return res.status(503).json({
      message: "Gemini API key is not configured.",
    });
  }

  try {
    // Gemini Prompt
    const prompt = `
Analyze the resume against the job description.

Return ONLY valid JSON with these keys:
score (0-100 number),
matched (string array),
missing (string array),
extras (string array),
required (string array),
experience (0-100 number),
title (string),
summary (string).

Do not invent experience or qualifications.
Score should be based primarily on required skills.

RESUME:
${resume.slice(0, 14000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 10000)}
`;

    // Call Gemini API
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
    });

    const raw = result.text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(raw);

    // Validate AI response
    if (
      typeof parsed.score !== "number" ||
      !Array.isArray(parsed.matched) ||
      !Array.isArray(parsed.missing)
    ) {
      throw new Error("Gemini returned an invalid analysis format.");
    }

    parsed.generatedAt = new Date().toISOString();

    // Save result in MongoDB
    const savedAnalysis = await Analysis.create({
      resume,
      jobDescription,
      ...parsed,
    });

    console.log(
      "Analysis saved in MongoDB:",
      savedAnalysis._id.toString()
    );

    // Send response to frontend
    return res.status(200).json({
      ...parsed,
      id: savedAnalysis._id.toString(),
    });

  } catch (error) {
    console.error("Analysis failed:", error.message);

    return res.status(502).json({
      message: "Gemini analysis or database saving failed.",
      error: error.message,
    });
  }
});

// Get All Saved Analyses
app.get("/api/analyses", async (_req, res) => {
  try {
    const analyses = await Analysis.find()
      .select("-resume -jobDescription")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(analyses);
  } catch (error) {
    console.error("History error:", error.message);

    res.status(500).json({
      message: "Could not fetch analysis history.",
    });
  }
});

// Get One Analysis by ID
app.get("/api/analyses/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid analysis ID.",
      });
    }

    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found.",
      });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch analysis.",
    });
  }
});

// Connect MongoDB and Start Server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in backend/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`TalentLens API running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();