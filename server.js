require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { GoogleGenAI } = require('@google/genai')
const mongoose = require('mongoose')

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '2mb' }))

const skills = ['python','sql','mysql','excel','power bi','tableau','pandas','numpy','matplotlib','seaborn','statistics','data cleaning','data visualization','dashboard development','machine learning','communication','problem-solving','aws','azure','tensorflow','scikit-learn','javascript','react','mongodb','postgresql','window functions','data storytelling','etl','git','linux','deep learning','nlp']

function localAnalysis(resume, jobDescription) {
  const r = skills.filter(s => resume.toLowerCase().includes(s))
  const j = skills.filter(s => jobDescription.toLowerCase().includes(s))
  const required = j.length ? j : ['sql','python','excel','power bi','communication']
  const matched = required.filter(s => r.includes(s))
  const missing = required.filter(s => !r.includes(s))
  const extras = r.filter(s => !required.includes(s))
  return {
    score: Math.min(98, Math.round(matched.length / Math.max(required.length, 1) * 100)),
    matched, missing, extras, required,
    experience: /experience|years|internship|worked/i.test(resume) ? 72 : 48,
    title: (jobDescription.match(/(?:junior |senior )?(?:data analyst|business analyst|software engineer|developer|machine learning engineer)/i) || ['Target role'])[0],
    summary: `Your resume currently demonstrates ${matched.length} of ${required.length} skills identified in this job description. Strengthen the missing skills and make relevant project outcomes more measurable.`,
    generatedAt: new Date().toISOString()
  }
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', geminiEnabled: Boolean(process.env.GEMINI_API_KEY), databaseEnabled: Boolean(process.env.MONGODB_URI) }))

app.post('/api/analyze', async (req, res) => {
  const { resume, jobDescription } = req.body || {}
  if (!resume?.trim() || !jobDescription?.trim()) return res.status(400).json({ message: 'Resume and job description are required.' })
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ message: 'Gemini key not configured. Use demo mode.' })
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const prompt = `Analyze the resume against the job description. Return ONLY valid JSON with keys: score (0-100 number), matched (string array), missing (string array), extras (string array), required (string array), experience (0-100 number), title (string), summary (string). Do not invent experience or qualifications. Score should be explainable and based primarily on required skills. Resume:\\n${resume.slice(0, 14000)}\\nJob description:\\n${jobDescription.slice(0, 10000)}`
    const result = await ai.models.generateContent({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', contents: prompt })
    const raw = result.text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(raw)
    parsed.generatedAt = new Date().toISOString()
    return res.json(parsed)
  } catch (error) {
    console.error('Gemini analysis failed:', error.message)
    return res.status(502).json({ message: 'AI analysis failed. The frontend will use demo matching instead.' })
  }
})

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err.message))
}

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`TalentLens API running at http://localhost:${port}`))
