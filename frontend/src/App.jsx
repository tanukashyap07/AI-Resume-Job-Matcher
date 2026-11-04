


import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  FileUser,
  BriefcaseBusiness,
  Target,
  BookOpenCheck,
  Settings,
  Bell,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  ChevronRight,
  Download,
  Trash2,
  Menu,
  X,
  Zap,
  GraduationCap,
  Clock3,
  Plus,
  BrainCircuit,
  Moon,
  Sun,
  TrendingUp,
  Trophy,
  Layers,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const sampleResume = `TANU KASHYAP
Data Analyst | Python | SQL | Excel | Power BI
SKILLS
Python, SQL, MySQL, Excel, Power BI, Pandas, NumPy, Matplotlib, Data Cleaning, Dashboard Development, Statistics, Communication
PROJECTS
Indian Railways EDA - cleaned and analyzed journey data using Python, Pandas and NumPy; built a Power BI dashboard.
EDUCATION
Bachelor of Computer Applications (Artificial Intelligence), 2027`;
const sampleJD = `Junior Data Analyst. Required skills:
- Strong SQL including joins and window functions
- Python with Pandas and NumPy
- Advanced Excel
- Power BI dashboard development and data visualization
- Data cleaning and statistics
- Good communication and problem-solving
Preferred: MySQL, data storytelling.`;

const skillBank = [
  "python",
  "sql",
  "mysql",
  "excel",
  "power bi",
  "tableau",
  "pandas",
  "numpy",
  "matplotlib",
  "seaborn",
  "statistics",
  "data cleaning",
  "data visualization",
  "dashboard development",
  "machine learning",
  "communication",
  "problem-solving",
  "aws",
  "azure",
  "tensorflow",
  "scikit-learn",
  "javascript",
  "react",
  "mongodb",
  "postgresql",
  "window functions",
  "data storytelling",
  "etl",
  "git",
  "linux",
  "deep learning",
  "nlp",
  "java",
  "c++",
  "c#",
  "typescript",
  "html",
  "css",
  "node.js",
  "django",
  "spring boot",
  "docker",
  "kubernetes",
  "rest api",
  "restful api",
  "microservices",
  "agile",
  "scrum",
  "ci/cd",
  "testing",
  "debugging",
  "code review",
  "redis",
  "graphql",
];
const jobs = [
  {
    title: "Junior Data Analyst",
    company: "Northstar Analytics",
    type: "Full time",
    location: "Noida · Hybrid",
    salary: "₹3.5–5.5 LPA",
    skills: [
      "sql",
      "python",
      "excel",
      "power bi",
      "pandas",
      "statistics",
      "data visualization",
    ],
  },
  {
    title: "Business Intelligence Intern",
    company: "MetricFlow",
    type: "Internship",
    location: "Remote · India",
    salary: "₹15k–25k / month",
    skills: [
      "power bi",
      "sql",
      "excel",
      "data storytelling",
      "dashboard development",
    ],
  },
  {
    title: "Python Data Analyst",
    company: "InsightWorks",
    type: "Full time",
    location: "Bengaluru · Hybrid",
    salary: "₹4–6 LPA",
    skills: ["python", "sql", "pandas", "numpy", "matplotlib", "etl"],
  },
  {
    title: "MIS Executive",
    company: "Vertex Operations",
    type: "Full time",
    location: "Delhi NCR · On-site",
    salary: "₹2.8–4 LPA",
    skills: ["excel", "sql", "communication", "dashboard development"],
  },
  {
    title: "Software Developer",
    company: "CodeCraft Labs",
    type: "Full time",
    location: "Bengaluru · Hybrid",
    salary: "₹6–12 LPA",
    skills: [
      "java",
      "python",
      "javascript",
      "git",
      "rest api",
      "sql",
      "testing",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Stackline",
    type: "Full time",
    location: "Remote · India",
    salary: "₹7–14 LPA",
    skills: [
      "react",
      "node.js",
      "javascript",
      "mongodb",
      "rest api",
      "git",
      "docker",
    ],
  },
  {
    title: "Backend Engineer",
    company: "Cloudbridge",
    type: "Full time",
    location: "Pune · Hybrid",
    salary: "₹8–16 LPA",
    skills: [
      "java",
      "spring boot",
      "microservices",
      "docker",
      "kubernetes",
      "aws",
      "postgresql",
    ],
  },
];
const nav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "analyze", label: "Resume analysis", icon: FileUser },
  { id: "jobs", label: "Job matches", icon: BriefcaseBusiness },
  { id: "roadmap", label: "Skill roadmap", icon: BookOpenCheck },
  { id: "history", label: "Analysis history", icon: Clock3 },
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const extractSkills = (text) => {
  const t = text.toLowerCase();
  return skillBank.filter((s) =>
    new RegExp(`(?<![a-z0-9])${esc(s)}(?:s|es)?(?![a-z0-9])`).test(t),
  );
};
function makeAnalysis(resume, jd) {
  const r = extractSkills(resume),
    j = extractSkills(jd);
  const required = j;
  const matched = required.filter((s) => r.includes(s));
  const missing = required.filter((s) => !r.includes(s));
  const extras = r.filter((s) => !required.includes(s));
  return {
    score: Math.min(
      98,
      Math.round((matched.length / Math.max(required.length, 1)) * 100),
    ),
    matched,
    missing,
    extras,
    required,
    experience: /experience|years|internship|worked/i.test(resume) ? 72 : 48,
    title: (jd.match(
      /(?:junior |senior )?(?:data analyst|business analyst|software developer|software engineer|full stack developer|developer|machine learning engineer)/i,
    ) || ["Target role"])[0],
    summary: required.length
      ? `Your resume shows ${matched.length} of ${required.length} skills this job asks for. Close the gaps and add measurable project results.`
      : "We could not find known skills in this job description. Paste the full job post, or use AI mode, which understands any role.",
    generatedAt: new Date().toISOString(),
  };
}
const scoreColor = (n) =>
  n >= 75 ? "#12a87a" : n >= 50 ? "#e6a23c" : "#e2604f";
const verdict = (n) =>
  n >= 75
    ? "Strong alignment"
    : n >= 50
      ? "Good foundation"
      : "Growth opportunity";

function Heading({ eyebrow, title, accent, sub, children }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>
          {title} <span>{accent}</span>
        </h1>
        {sub && <p>{sub}</p>}
      </div>
      {children}
    </div>
  );
}
function SkillCol({ cls, icon: Icon, title, items, pill, empty }) {
  return (
    <div>
      <div className={`skill-heading ${cls}`}>
        <Icon size={16} /> {title} <span>{items.length}</span>
      </div>
      <div className="skill-pills">
        {items.length ? (
          items.map((s) => (
            <span className={`pill ${pill}`} key={s}>
              {s}
            </span>
          ))
        ) : (
          <small className="muted">{empty}</small>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("overview"),
    [mobileOpen, setMobileOpen] = useState(false);
  const [resume, setResume] = useState(""),
    [jd, setJd] = useState(""),
    [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState(null),
    [busy, setBusy] = useState(false),
    [mode, setMode] = useState("demo");
  const [notice, setNotice] = useState(""),
    fileRef = useRef(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("tl-theme") || "light",
  );
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("talentlens-history") || "[]");
    } catch {
      return [];
    }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("tl-theme", theme);
  }, [theme]);

  const matchedJobs = useMemo(() => {
    const have = analysis ? [...analysis.matched, ...analysis.extras] : [];
    return jobs
      .map((j) => {
        const got = j.skills.filter((s) => have.includes(s));
        return {
          ...j,
          got,
          lack: j.skills.filter((s) => !have.includes(s)),
          match: analysis
            ? Math.round((got.length / j.skills.length) * 100)
            : 0,
        };
      })
      .sort((a, b) => b.match - a.match);
  }, [analysis]);

  async function readFile(file) {
    if (!file) return;
    setFileName(file.name);
    try {
      if (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      ) {
        const pdf = await pdfjsLib.getDocument({
          data: new Uint8Array(await file.arrayBuffer()),
        }).promise;
        let content = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const t = await (await pdf.getPage(i)).getTextContent();
          content += t.items.map((x) => x.str).join(" ") + "\n";
        }
        setResume(content);
      } else setResume(await file.text());
      setNotice("Resume loaded successfully.");
    } catch {
      setNotice(
        "Could not read this file. Try a text-based PDF or a TXT file.",
      );
    }
  }
  async function runAnalysis() {
    if (!resume.trim() || !jd.trim())
      return setNotice("Please add both your resume and a job description.");
    setBusy(true);
    setNotice("");
    try {
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription: jd }),
      });
      if (!res.ok) throw new Error("API unavailable");
      setAnalysis(await res.json());
      setMode("gemini");
    } catch {
      setAnalysis(makeAnalysis(resume, jd));
      setMode("demo");
    }
    setBusy(false);
    setPage("overview");
  }
  function saveReport(data) {
    const next = [
      {
        ...data,
        id: Date.now(),
        fileName: fileName || "Pasted resume",
        role: data.title || "Target role",
      },
      ...history,
    ];
    setHistory(next);
    localStorage.setItem("talentlens-history", JSON.stringify(next));
    setNotice("Analysis saved to your history.");
  }
  function downloadReport() {
    if (!analysis) return;
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            { resumeFile: fileName, jobDescription: jd, analysis },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-analysis-report.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("talentlens-history");
  };
  const avg = history.length
    ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
    : null;
  const best = history.length ? Math.max(...history.map((h) => h.score)) : null;
  const active = nav.find((n) => n.id === page)?.label;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "show" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <BrainCircuit size={22} />
          </div>
          <div>
            <b>
              talent<span>lens</span>
            </b>
            <small>AI CAREER INTELLIGENCE</small>
          </div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {nav.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => {
                setPage(n.id);
                setMobileOpen(false);
              }}
            >
              <n.icon size={18} />
              <span>{n.label}</span>
              {n.id === "jobs" && analysis && <em>{matchedJobs.length}</em>}
              {n.id === "history" && history.length > 0 && (
                <em>{history.length}</em>
              )}
            </button>
          ))}
        </nav>
        <div className="side-card">
          <div className="side-icon">
            <Sparkles size={17} />
          </div>
          <b>Make your next move count</b>
          <p>Understand your strengths and close the skill gaps that matter.</p>
          <button onClick={() => setPage("analyze")}>
            Analyze my resume <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="sidebar-bottom">
          <div className="avatar">TK</div>
          <div>
            <b>Candidate workspace</b>
            <small>Free project edition</small>
          </div>
          <Settings size={17} className="muted" />
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="hamburger" onClick={() => setMobileOpen(true)}>
            <Menu />
          </button>
          <div className="crumb">
            Workspace <ChevronRight size={14} />
            <b>{active}</b>
          </div>
          <div className="top-actions">
            <div className="status-pill">
              <span /> {mode === "gemini" ? "AI connected" : "Demo mode"}
            </div>
            <button
              className="icon-btn"
              title="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-btn" title="Notifications">
              <Bell size={18} />
            </button>
            <div className="top-avatar">TK</div>
          </div>
        </header>

        <div className="content">
          {notice && (
            <div className="notice">
              <CheckCircle2 size={16} />
              {notice}
              <button onClick={() => setNotice("")}>
                <X size={14} />
              </button>
            </div>
          )}

          {page === "overview" && !analysis && (
            <section>
              <div className="welcome-banner">
                <div className="welcome-copy">
                  <div className="eyebrow light">YOUR CAREER, WITH CLARITY</div>
                  <h1>
                    Find your <i>next opportunity.</i>
                  </h1>
                  <p>
                    Paste your resume and any job description. In seconds you
                    see which skills match, which are missing, and exactly what
                    to learn first.
                  </p>
                  <button
                    className="white-btn"
                    onClick={() => setPage("analyze")}
                  >
                    Start resume analysis <ArrowUpRight size={17} />
                  </button>
                  <div className="trust-row">
                    <span>PDF or TXT</span>
                    <span>Results in seconds</span>
                    <span>Free 7-day plan</span>
                  </div>
                </div>
                <div className="hero-art">
                  <div className="orbit orbit-one" />
                  <div className="orbit orbit-two" />
                  <div className="hero-document">
                    <div className="doc-top">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="doc-avatar" />
                    <div className="doc-line wide" />
                    <div className="doc-line" />
                    <div className="doc-line short" />
                    <div className="doc-divider" />
                    <div className="doc-line wide" />
                    <div className="doc-line" />
                    <div className="doc-line short" />
                  </div>
                  <div className="floating-score">
                    <Sparkles size={15} />
                    <b>92%</b>
                    <small>Profile strength</small>
                  </div>
                  <div className="floating-check">
                    <CheckCircle2 size={19} />
                  </div>
                </div>
              </div>
              <div className="section-title-row">
                <div>
                  <h2>Your workspace</h2>
                  <p>A quick look at your career matching activity.</p>
                </div>
                <button className="text-btn" onClick={() => setPage("analyze")}>
                  New analysis <ArrowUpRight size={15} />
                </button>
              </div>
              <div className="stat-grid">
                <Stat
                  icon={FileUser}
                  label="Reports saved"
                  value={history.length}
                  sub="Stored on this device"
                  color="violet"
                />
                <Stat
                  icon={TrendingUp}
                  label="Average match"
                  value={avg === null ? "—" : avg + "%"}
                  sub="Across saved reports"
                  color="blue"
                />
                <Stat
                  icon={Trophy}
                  label="Best match"
                  value={best === null ? "—" : best + "%"}
                  sub="Your top score so far"
                  color="green"
                />
                <Stat
                  icon={Layers}
                  label="Roles tracked"
                  value={jobs.length}
                  sub="Ready to match"
                  color="amber"
                />
              </div>
              <div className="how-grid">
                {[
                  [
                    "Scan",
                    "We read your resume and the job post, then pull out every skill both mention.",
                    "#c6ecd9",
                  ],
                  [
                    "Compare",
                    "Each required skill is checked against your resume, so you see matches, gaps and extras.",
                    "#cfe4ff",
                  ],
                  [
                    "Act",
                    "Get ranked jobs and a 7-day plan that starts with the gap that matters most.",
                    "#ffd9bd",
                  ],
                ].map(([t, d, c], i) => (
                  <div className="how-card" style={{ background: c }} key={t}>
                    <span>{i + 1}</span>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                ))}
              </div>
              <div className="bottom-grid">
                <div className="panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Get started in 3 steps</h3>
                      <p>Your path to a more targeted application.</p>
                    </div>
                    <span className="tiny-badge">QUICK START</span>
                  </div>
                  {[
                    [
                      "Upload your resume",
                      "Add your latest resume as PDF or TXT.",
                    ],
                    [
                      "Add a job description",
                      "Paste the role you want to target.",
                    ],
                    [
                      "Review your match",
                      "See strengths, skill gaps and next steps.",
                    ],
                  ].map(([t, d], i) => (
                    <div className="start-step" key={t}>
                      <div className="step-number">0{i + 1}</div>
                      <div>
                        <b>{t}</b>
                        <p>{d}</p>
                      </div>
                      <ArrowUpRight size={18} />
                    </div>
                  ))}
                  <button
                    className="primary-btn full"
                    onClick={() => setPage("analyze")}
                  >
                    Analyze my resume <ChevronRight size={17} />
                  </button>
                </div>
                <div className="panel insight-card">
                  <div className="insight-top">
                    <div className="panel-icon purple">
                      <BrainCircuit size={18} />
                    </div>
                    <span className="tiny-badge">CAREER TIP</span>
                  </div>
                  <h3>Recruiters skim. Show proof, fast.</h3>
                  <p>
                    A skills list tells them what you know. A project bullet
                    tells them what you did with it. For each project, name the
                    data, the tools and the result.
                  </p>
                  <div className="tip-example">
                    <span>TRY THIS</span>
                    <b>
                      “Analyzed 10,000+ records with Python and SQL to find
                      trends and built a Power BI dashboard.”
                    </b>
                  </div>
                </div>
              </div>
            </section>
          )}

          {page === "overview" && analysis && (
            <section>
              <Heading
                eyebrow={`LATEST ANALYSIS · ${mode === "gemini" ? "GEMINI AI" : "DEMO ENGINE"}`}
                title="Your match"
                accent="report."
                sub={analysis.summary}
              >
                <div className="heading-actions">
                  <button className="secondary-btn" onClick={downloadReport}>
                    <Download size={16} /> Export
                  </button>
                  <button
                    className="primary-btn"
                    onClick={() => setPage("analyze")}
                  >
                    <Plus size={16} /> New analysis
                  </button>
                </div>
              </Heading>
              <div className="report-grid">
                <div className="panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Overall compatibility</h3>
                      <p>{analysis.title} role</p>
                    </div>
                    <span className="tiny-badge">
                      {mode === "gemini" ? "AI ANALYSIS" : "RULE-BASED"}
                    </span>
                  </div>
                  <div className="score-content">
                    <div
                      key={analysis.generatedAt}
                      className="score-ring"
                      style={{
                        "--target": analysis.score,
                        "--ring": scoreColor(analysis.score),
                      }}
                    >
                      <div>
                        <b>{analysis.score}%</b>
                        <small>match score</small>
                      </div>
                    </div>
                    <div className="score-explain">
                      <h3>{verdict(analysis.score)}</h3>
                      <p>{analysis.summary}</p>
                      <div className="legend">
                        <span>
                          <i className="green-dot" />
                          Matched
                        </span>
                        <span>
                          <i className="red-dot" />
                          Missing
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Skill breakdown</h3>
                      <p>What the role asks for.</p>
                    </div>
                    <Target size={18} className="muted" />
                  </div>
                  <div className="breakdown-number">
                    <b>{analysis.matched.length}</b>
                    <span>
                      of {analysis.required.length} required skills found
                    </span>
                  </div>
                  <div className="progress-track">
                    <div style={{ width: analysis.score + "%" }} />
                  </div>
                  <div className="breakdown-meta">
                    <span>Skill coverage</span>
                    <b>{analysis.score}%</b>
                  </div>
                  <div className="breakdown-meta">
                    <span>Experience signal</span>
                    <b>{analysis.experience}%</b>
                  </div>
                  <div className="breakdown-meta">
                    <span>Extra skills</span>
                    <b>{analysis.extras.length}</b>
                  </div>
                </div>
              </div>
              <div className="priority">
                <div>
                  <span className="tiny-badge">Your fastest win</span>
                  <h3>
                    {analysis.missing.length
                      ? `Show ${analysis.missing[0]} on your resume`
                      : "You cover every skill this role asks for"}
                  </h3>
                  <p>
                    {analysis.missing.length
                      ? "It is the first requirement your resume does not show. Add one project bullet that uses it, with a number for the result."
                      : "Now make each project bullet measurable, so recruiters see impact and not only tools."}
                  </p>
                </div>
                <ul>
                  {[
                    "Mirror the job's own wording",
                    "Start bullets with a result",
                    "Keep it to one clear page",
                  ].map((t) => (
                    <li key={t}>
                      <CheckCircle2 size={16} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="panel skills-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Skills intelligence</h3>
                    <p>Skills found in your resume and the job description.</p>
                  </div>
                  <button
                    className="text-btn"
                    onClick={() => setPage("roadmap")}
                  >
                    View roadmap <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="skills-columns">
                  <SkillCol
                    cls=""
                    icon={CheckCircle2}
                    title="Matched skills"
                    items={analysis.matched}
                    pill="matched"
                    empty="No direct matches yet."
                  />
                  <SkillCol
                    cls="missing"
                    icon={CircleAlert}
                    title="Skills to develop"
                    items={analysis.missing}
                    pill="missing-pill"
                    empty="No missing skills."
                  />
                  <SkillCol
                    cls="extra"
                    icon={Zap}
                    title="Additional strengths"
                    items={analysis.extras}
                    pill="extra-pill"
                    empty="No extra skills found."
                  />
                </div>
              </div>
              <div className="bottom-grid report-bottom">
                <div className="panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Recommended opportunities</h3>
                      <p>Roles that fit your current skills.</p>
                    </div>
                    <button
                      className="text-btn"
                      onClick={() => setPage("jobs")}
                    >
                      All jobs <ArrowUpRight size={14} />
                    </button>
                  </div>
                  {matchedJobs.slice(0, 3).map((j) => (
                    <div className="compact-job" key={j.title}>
                      <div className="company-logo">{j.company[0]}</div>
                      <div>
                        <b>{j.title}</b>
                        <small>
                          {j.company} · {j.location}
                        </small>
                      </div>
                      <strong>{j.match}%</strong>
                    </div>
                  ))}
                </div>
                <div className="panel next-panel">
                  <div className="panel-icon blue">
                    <GraduationCap size={19} />
                  </div>
                  <h3>Turn gaps into growth.</h3>
                  <p>
                    Get a focused learning plan for the skills that can lift
                    your match.
                  </p>
                  <button
                    className="primary-btn full"
                    onClick={() => setPage("roadmap")}
                  >
                    Build my roadmap <ArrowUpRight size={15} />
                  </button>
                  <button
                    className="text-btn save-link"
                    onClick={() => saveReport(analysis)}
                  >
                    <CheckCircle2 size={14} /> Save this report
                  </button>
                </div>
              </div>
            </section>
          )}

          {page === "analyze" && (
            <section>
              <Heading
                eyebrow="CAREER MATCHING ENGINE"
                title="Analyze your"
                accent="fit."
                sub="Compare your resume with a role and see where you stand."
              >
                <div className="step-chip">
                  <Sparkles size={15} /> AI-powered analysis
                </div>
              </Heading>
              <div className="analysis-grid">
                <div className="panel input-panel">
                  <div className="panel-title">
                    <div className="panel-icon purple">
                      <FileUser size={18} />
                    </div>
                    <div>
                      <h3>Your resume</h3>
                      <p>Upload a PDF or TXT, or paste the text</p>
                    </div>
                    <span className="required">REQUIRED</span>
                  </div>
                  <div
                    className="dropzone"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      readFile(e.dataTransfer.files[0]);
                    }}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.txt"
                      hidden
                      onChange={(e) => readFile(e.target.files[0])}
                    />
                    <div className="upload-icon">
                      <UploadCloud size={23} />
                    </div>
                    <b>{fileName || "Drop your resume here"}</b>
                    <span>or browse files · PDF, TXT</span>
                    <small>Recommended size: under 5 MB</small>
                  </div>
                  <div className="or-divider">
                    <span>OR PASTE RESUME TEXT</span>
                  </div>
                  <textarea
                    className="large-textarea"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    placeholder="Paste your resume here..."
                    rows="10"
                  />
                  <div className="field-foot">
                    <span>
                      {resume.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <button
                      className="text-btn"
                      onClick={() => {
                        setResume(sampleResume);
                        setFileName("Sample Data Analyst Resume.txt");
                      }}
                    >
                      Use sample resume
                    </button>
                  </div>
                </div>
                <div className="panel input-panel">
                  <div className="panel-title">
                    <div className="panel-icon blue">
                      <BriefcaseBusiness size={18} />
                    </div>
                    <div>
                      <h3>Target job description</h3>
                      <p>Paste the role you want to apply for</p>
                    </div>
                    <span className="required">REQUIRED</span>
                  </div>
                  <div className="jd-hint">
                    <Target size={17} />
                    <span>
                      Include responsibilities, requirements and preferred
                      skills for a better comparison.
                    </span>
                  </div>
                  <textarea
                    className="large-textarea jd-area"
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows="14"
                  />
                  <div className="field-foot">
                    <span>
                      {jd.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <button
                      className="text-btn"
                      onClick={() => setJd(sampleJD)}
                    >
                      Load sample job description
                    </button>
                  </div>
                  <button
                    className="primary-btn analyze-btn"
                    disabled={busy}
                    onClick={runAnalysis}
                  >
                    {busy ? (
                      <>
                        <span className="spinner" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={17} /> Analyze compatibility{" "}
                        <ArrowUpRight size={16} />
                      </>
                    )}
                  </button>
                  <p className="privacy-note">
                    <CheckCircle2 size={13} /> In demo mode your resume stays in
                    this browser.
                  </p>
                </div>
              </div>
            </section>
          )}

          {page === "jobs" && (
            <section>
              <Heading
                eyebrow="OPPORTUNITY DISCOVERY"
                title="Jobs that match"
                accent="you."
                sub="Roles ranked by the skills in your latest analysis. Green skills you have, red skills you still need."
              >
                <button
                  className="secondary-btn"
                  onClick={() => setPage("analyze")}
                >
                  <Plus size={16} /> New analysis
                </button>
              </Heading>
              <div className="job-list">
                {matchedJobs.map((job) => (
                  <div className="job-card" key={job.title}>
                    <div className="company-logo">{job.company[0]}</div>
                    <div className="job-info">
                      <div className="job-company">
                        {job.company} <span>· {job.type}</span>
                      </div>
                      <h3>{job.title}</h3>
                      <p>
                        {job.location} · {job.salary}
                      </p>
                      <div className="tag-row">
                        {analysis ? (
                          <>
                            {job.got.map((s) => (
                              <span className="skill-tag have" key={s}>
                                {s}
                              </span>
                            ))}
                            {job.lack.map((s) => (
                              <span className="skill-tag lack" key={s}>
                                {s}
                              </span>
                            ))}
                          </>
                        ) : (
                          job.skills.map((s) => (
                            <span className="skill-tag" key={s}>
                              {s}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="job-match">
                      <div
                        className="mini-score"
                        style={{ "--score": job.match + "%" }}
                      >
                        <b>{analysis ? job.match + "%" : "—"}</b>
                      </div>
                      <small>skill match</small>
                    </div>
                    <button
                      className="round-arrow"
                      onClick={() => setPage("analyze")}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
              {!analysis && (
                <div className="empty-hint">
                  <Sparkles size={18} /> Run a resume analysis to see your match
                  for each role.
                </div>
              )}
            </section>
          )}

          {page === "roadmap" && (
            <Roadmap analysis={analysis} setPage={setPage} />
          )}

          {page === "history" && (
            <section>
              <Heading
                eyebrow="YOUR PROGRESS"
                title="Analysis"
                accent="history."
                sub="Reports saved in this browser."
              >
                {history.length > 0 && (
                  <button
                    className="secondary-btn danger-btn"
                    onClick={clearHistory}
                  >
                    <Trash2 size={15} /> Clear history
                  </button>
                )}
              </Heading>
              {history.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Clock3 size={28} />
                  </div>
                  <h3>No saved analyses yet</h3>
                  <p>
                    Save a report from your match results and it will appear
                    here, so you can see your score improve over time.
                  </p>
                  <button
                    className="primary-btn"
                    onClick={() => setPage("analyze")}
                  >
                    Start an analysis
                  </button>
                </div>
              ) : (
                <div className="history-list">
                  {history.map((h) => (
                    <div className="history-row" key={h.id}>
                      <div className="history-file">
                        <FileText size={19} />
                      </div>
                      <div className="history-details">
                        <b>{h.role}</b>
                        <span>
                          {h.fileName} ·{" "}
                          {new Date(h.generatedAt).toLocaleString()}
                        </span>
                      </div>
                      <strong style={{ color: scoreColor(h.score) }}>
                        {h.score}%
                      </strong>
                      <button
                        className="round-arrow"
                        onClick={() => {
                          setAnalysis(h);
                          setPage("overview");
                        }}
                      >
                        <ArrowUpRight size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
        <footer>
          © 2026 TalentLens <span>Made to help you apply with confidence</span>
        </footer>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={18} />
      </div>
      <span>{label}</span>
      <b>{value}</b>
      <small>{sub}</small>
    </div>
  );
}

function Roadmap({ analysis, setPage }) {
  const gaps = analysis
    ? analysis.missing
    : [
        "window functions",
        "advanced excel",
        "power bi dax",
        "data storytelling",
      ];
  const noGaps = analysis && !gaps.length;
  const steps = [
    {
      day: "DAY 1–2",
      title: noGaps
        ? "Make your projects measurable"
        : `Learn the basics of ${gaps[0]}`,
      desc: "Watch one short tutorial, then finish a guided exercise. Aim for a working example, not full mastery.",
      icon: BookOpenCheck,
    },
    {
      day: "DAY 3–4",
      title: `Practice ${gaps[1] || "a small project"}`,
      desc: "Use it on a small real dataset. Write two lines on what you tried and what you found.",
      icon: Target,
    },
    {
      day: "DAY 5–6",
      title: "Create proof of work",
      desc: "Turn the work into one resume bullet with a number in it, and save a screenshot for your portfolio.",
      icon: Layers,
    },
    {
      day: "DAY 7",
      title: "Review and explain",
      desc: "Explain your project out loud in two minutes. If you can teach it, you can answer it in an interview.",
      icon: GraduationCap,
    },
  ];
  return (
    <section>
      <Heading
        eyebrow="PERSONAL DEVELOPMENT PLAN"
        title="Your skill"
        accent="roadmap."
        sub="A practical 7-day starter plan to strengthen your match."
      >
        <span className="step-chip">
          <Zap size={15} /> 7-day sprint
        </span>
      </Heading>
      <div className="roadmap-layout">
        <div className="panel roadmap-main">
          <div className="roadmap-intro">
            <div className="roadmap-icon">
              <GraduationCap size={23} />
            </div>
            <div>
              <h3>
                {analysis
                  ? "Your personalized learning sprint"
                  : "Your starter learning sprint"}
              </h3>
              <p>
                {analysis
                  ? noGaps
                    ? "No skill gaps found. Use this week to make your projects measurable."
                    : `Focus on ${gaps.length} missing skills from your latest analysis.`
                  : "Run an analysis to tailor this plan to your gaps."}
              </p>
            </div>
          </div>
          <div className="timeline">
            {steps.map((s, i) => (
              <div className="timeline-item" key={s.day}>
                <div className="timeline-marker">
                  <s.icon size={17} />
                </div>
                <div className="timeline-copy">
                  <span>{s.day}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                <span className="task-count">
                  {i === 0 ? gaps.length + " topics" : "1 milestone"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel gap-side">
          <div className="panel-icon purple">
            <Target size={18} />
          </div>
          <h3>Your focus areas</h3>
          <p>
            Prioritize skills the job asks for that your resume doesn't show
            yet.
          </p>
          <div className="focus-list">
            {noGaps && (
              <small className="muted">Nothing missing. Nice work.</small>
            )}
            {gaps.slice(0, 6).map((s, i) => (
              <div key={s}>
                <span>{i + 1}</span>
                <b>{s}</b>
                <small>{i < 2 ? "High focus" : "Build next"}</small>
              </div>
            ))}
          </div>
          <button
            className="primary-btn full"
            onClick={() => setPage("analyze")}
          >
            Update my analysis <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
