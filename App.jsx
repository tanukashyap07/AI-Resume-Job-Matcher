import React, { useMemo, useRef, useState } from 'react'
import { LayoutDashboard, FileUser, BriefcaseBusiness, Target, BookOpenCheck, Settings, Bell, Search, UploadCloud, FileText, Sparkles, ArrowUpRight, CheckCircle2, CircleAlert, ChevronRight, Download, Trash2, Menu, X, Zap, GraduationCap, Code2, ChartNoAxesCombined, Clock3, Plus, BrainCircuit } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const sampleResume = `TANU KASHYAP
Data Analyst | Python | SQL | Excel | Power BI
Email: candidate@example.com | Meerut, India

SUMMARY
Aspiring Data Analyst and BCA Artificial Intelligence student with hands-on experience in Python, SQL, Excel, Power BI and exploratory data analysis. Interested in transforming raw data into useful business insights.

SKILLS
Python, SQL, MySQL, Excel, Power BI, Pandas, NumPy, Matplotlib, Data Cleaning, Exploratory Data Analysis, Dashboard Development, Statistics, Communication

PROJECTS
Indian Railways Exploratory Data Analysis
- Cleaned and analyzed railway journey data using Python, Pandas and NumPy.
- Explored cancellation patterns, delays, revenue and passenger trends.
- Prepared insights for an interactive Power BI dashboard.

Cybersecurity Analytics Dashboard
- Explored security event data and identified trends in threats and incidents.
- Designed dashboard metrics and visual summaries.

EDUCATION
Bachelor of Computer Applications (Artificial Intelligence), 2027
` 
const sampleJD = `We are looking for a Junior Data Analyst to work with business teams and transform data into actionable insights.

Required skills:
- Strong SQL knowledge including joins, subqueries and window functions
- Python programming with Pandas and NumPy
- Advanced Excel, pivot tables and lookup functions
- Power BI dashboard development and data visualization
- Data cleaning, exploratory data analysis and statistics
- Good communication and problem-solving skills

Preferred:
- Knowledge of MySQL
- Experience with business reporting
- Understanding of data storytelling
- Bachelor's degree in Computer Science, IT, Statistics or related field
`
const skillBank = ['python','sql','mysql','excel','power bi','tableau','pandas','numpy','matplotlib','seaborn','statistics','data cleaning','data visualization','dashboard development','machine learning','communication','problem-solving','aws','azure','tensorflow','scikit-learn','javascript','react','mongodb','postgresql','window functions','data storytelling','etl','git','linux','deep learning','nlp']
const jobs = [
 { title:'Junior Data Analyst', company:'Northstar Analytics', type:'Full time', location:'Noida · Hybrid', skills:['sql','python','excel','power bi','pandas','statistics','data visualization'], salary:'₹3.5–5.5 LPA' },
 { title:'Business Intelligence Intern', company:'MetricFlow', type:'Internship', location:'Remote · India', skills:['power bi','sql','excel','data storytelling','dashboard development'], salary:'₹15k–25k / month' },
 { title:'Python Data Analyst', company:'InsightWorks', type:'Full time', location:'Bengaluru · Hybrid', skills:['python','sql','pandas','numpy','matplotlib','etl'], salary:'₹4–6 LPA' },
 { title:'MIS Executive', company:'Vertex Operations', type:'Full time', location:'Delhi NCR · On-site', skills:['excel','sql','communication','dashboard development'], salary:'₹2.8–4 LPA' }
]
const nav = [
 { id:'overview', label:'Overview', icon:LayoutDashboard },
 { id:'analyze', label:'Resume analysis', icon:FileUser },
 { id:'jobs', label:'Job matches', icon:BriefcaseBusiness },
 { id:'roadmap', label:'Skill roadmap', icon:BookOpenCheck },
 { id:'history', label:'Analysis history', icon:Clock3 }
]
function extractSkills(text) {
 const lower = text.toLowerCase()
 return skillBank.filter(s => lower.includes(s))
}
function makeAnalysis(resume, jd) {
 const r = extractSkills(resume), j = extractSkills(jd)
 const required = j.length ? j : ['sql','python','excel','power bi','communication']
 const matched = required.filter(s => r.includes(s))
 const missing = required.filter(s => !r.includes(s))
 const extras = r.filter(s => !required.includes(s))
 const score = Math.min(98, Math.round((matched.length / Math.max(required.length,1))*100))
 const exp = /experience|years|internship|worked/i.test(resume) ? 72 : 48
 return { score, matched, missing, extras, required, experience:exp, title: (jd.match(/(?:junior |senior )?(?:data analyst|business analyst|software engineer|developer|machine learning engineer)/i)||['Target role'])[0], summary:`Your resume currently demonstrates ${matched.length} of ${required.length} skills identified in this job description. Strengthen the missing skills and make relevant project outcomes more measurable.`, generatedAt:new Date().toISOString() }
}
function scoreColor(n){ return n>=75?'#16a779':n>=50?'#e6a23c':'#ef6b65' }
function App(){
 const [page,setPage]=useState('overview'), [mobileOpen,setMobileOpen]=useState(false)
 const [resume,setResume]=useState(''), [jd,setJd]=useState(''), [fileName,setFileName]=useState('')
 const [analysis,setAnalysis]=useState(null), [busy,setBusy]=useState(false), [mode,setMode]=useState('demo')
 const [history,setHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem('talentlens-history')||'[]')}catch{return[]}})
 const [notice,setNotice]=useState(''), fileRef=useRef(null)
 const savedCount=history.length
 const matchedJobs=useMemo(()=>jobs.map(job=>({...job,match:analysis?Math.round(job.skills.filter(s=>analysis.matched.includes(s)).length/job.skills.length*100):0})).sort((a,b)=>b.match-a.match),[analysis])
 async function readFile(file){
  if(!file)return
  setFileName(file.name)
  try{
   if(file.type==='application/pdf'||file.name.toLowerCase().endsWith('.pdf')){
    const data=new Uint8Array(await file.arrayBuffer()); const pdf=await pdfjsLib.getDocument({data}).promise
    let content=''; for(let i=1;i<=pdf.numPages;i++){const p=await pdf.getPage(i);const t=await p.getTextContent();content+=t.items.map(x=>x.str).join(' ')+'\\n'}
    setResume(content)
   }else setResume(await file.text())
   setNotice('Resume loaded successfully.')
  }catch(e){setNotice('Could not read this file. Please try a text-based PDF or TXT file.')}
 }
 async function runAnalysis(){
  if(!resume.trim()||!jd.trim()){setNotice('Please add both your resume and a job description.');return}
  setBusy(true);setNotice('')
  try{
   const response=await fetch('http://localhost:5000/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({resume,jobDescription:jd})})
   if(response.ok){const data=await response.json();setAnalysis(data);setMode('gemini')}
   else throw new Error('API unavailable')
  }catch{
   const data=makeAnalysis(resume,jd);setAnalysis(data);setMode('demo')
  }
  setBusy(false);setPage('overview')
 }
 function saveReport(data){
  const item={...data,id:Date.now(),fileName:fileName||'Pasted resume',role:data.title||'Target role'}
  const next=[item,...history];setHistory(next);localStorage.setItem('talentlens-history',JSON.stringify(next));setNotice('Analysis saved to your history.')
 }
 function downloadReport(){
  if(!analysis)return
  const blob=new Blob([JSON.stringify({project:'TalentLens Resume Analysis',resumeFile:fileName,jobDescription:jd,analysis},null,2)],{type:'application/json'})
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='resume-analysis-report.json';a.click();URL.revokeObjectURL(url)
 }
 function clearHistory(){setHistory([]);localStorage.removeItem('talentlens-history')}
 const active=nav.find(n=>n.id===page)?.label||'Overview'
 return <div className="app-shell">
  <aside className={`sidebar ${mobileOpen?'show':''}`}>
   <div className="brand"><div className="brand-mark"><BrainCircuit size={22}/></div><div><b>talent<span>lens</span></b><small>AI CAREER INTELLIGENCE</small></div><button className="mobile-close" onClick={()=>setMobileOpen(false)}><X size={18}/></button></div>
   <div className="workspace-label">WORKSPACE</div>
   <nav>{nav.map(n=><button key={n.id} className={`nav-item ${page===n.id?'active':''}`} onClick={()=>{setPage(n.id);setMobileOpen(false)}}><n.icon size={18}/><span>{n.label}</span>{n.id==='jobs'&&analysis&&<em>{matchedJobs.length}</em>}</button>)}</nav>
   <div className="side-card"><div className="side-icon"><Sparkles size={17}/></div><b>Make your next move count</b><p>Understand your strengths and close the skill gaps that matter.</p><button onClick={()=>setPage('analyze')}>Analyze my resume <ArrowUpRight size={14}/></button></div>
   <div className="sidebar-bottom"><div className="avatar">TK</div><div><b>Candidate workspace</b><small>Free project edition</small></div><Settings size={17} className="muted"/></div>
  </aside>
  <main className="main">
   <header className="topbar"><button className="hamburger" onClick={()=>setMobileOpen(true)}><Menu/></button><div className="crumb">Workspace <ChevronRight size={14}/><b>{active}</b></div><div className="top-actions"><div className="status-pill"><span/> {mode==='gemini'?'AI connected':'Demo mode'}</div><button className="icon-btn" title="Notifications"><Bell size={18}/></button><div className="top-avatar">TK</div></div></header>
   <div className="content">
    {notice&&<div className="notice"><CheckCircle2 size={16}/>{notice}<button onClick={()=>setNotice('')}><X size={14}/></button></div>}
    {page==='overview'&&<Overview analysis={analysis} matchedJobs={matchedJobs} setPage={setPage} savedCount={savedCount} mode={mode} runAnalysis={runAnalysis} busy={busy} saveReport={saveReport} downloadReport={downloadReport}/>}
    {page==='analyze'&&<section><div className="page-heading"><div><div className="eyebrow">CAREER MATCHING ENGINE</div><h1>Analyze your <span>fit.</span></h1><p>Compare your experience with a role and discover where you stand.</p></div><div className="step-chip"><Sparkles size={15}/> AI-powered analysis</div></div><div className="analysis-grid"><div className="panel input-panel"><div className="panel-title"><div className="panel-icon purple"><FileUser size={18}/></div><div><h3>Your resume</h3><p>Upload a PDF or TXT, or paste your resume</p></div><span className="required">REQUIRED</span></div><div className="dropzone" onClick={()=>fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();readFile(e.dataTransfer.files[0])}}><input ref={fileRef} type="file" accept=".pdf,.txt" hidden onChange={e=>readFile(e.target.files[0])}/><div className="upload-icon"><UploadCloud size={23}/></div><b>{fileName||'Drop your resume here'}</b><span>or browse files · PDF, TXT</span><small>Maximum recommended size: 5 MB</small></div><div className="or-divider"><span>OR PASTE RESUME TEXT</span></div><textarea className="large-textarea" value={resume} onChange={e=>setResume(e.target.value)} placeholder="Paste your resume content here..." rows="10"/><div className="field-foot"><span>{resume.trim().split(/\s+/).filter(Boolean).length} words</span><button className="text-btn" onClick={()=>{setResume(sampleResume);setFileName('Sample Data Analyst Resume.txt')}}>Use sample resume</button></div></div>
    <div className="panel input-panel"><div className="panel-title"><div className="panel-icon blue"><BriefcaseBusiness size={18}/></div><div><h3>Target job description</h3><p>Paste the role you want to apply for</p></div><span className="required">REQUIRED</span></div><div className="jd-hint"><Target size={17}/><span>Tip: Include responsibilities, requirements and preferred skills for a better comparison.</span></div><textarea className="large-textarea jd-area" value={jd} onChange={e=>setJd(e.target.value)} placeholder="Paste the complete job description here..." rows="18"/><div className="field-foot"><span>{jd.trim().split(/\s+/).filter(Boolean).length} words</span><button className="text-btn" onClick={()=>setJd(sampleJD)}>Load sample job description</button></div><button className="primary-btn analyze-btn" disabled={busy} onClick={runAnalysis}>{busy?<><span className="spinner"/> Analyzing...</>:<><Sparkles size={17}/> Analyze compatibility <ArrowUpRight size={16}/></>}</button><p className="privacy-note"><CheckCircle2 size={13}/> Your resume stays in this browser in demo mode.</p></div></div></section>}
    {page==='jobs'&&<section><div className="page-heading"><div><div className="eyebrow">OPPORTUNITY DISCOVERY</div><h1>Jobs that match <span>you.</span></h1><p>Explore roles ranked against the skills in your latest analysis.</p></div><button className="secondary-btn" onClick={()=>setPage('analyze')}><Plus size={16}/> New analysis</button></div><div className="job-list">{matchedJobs.map((job,i)=><div className="job-card" key={job.title}><div className="company-logo">{job.company.slice(0,1)}</div><div className="job-info"><div className="job-company">{job.company} <span>· {job.type}</span></div><h3>{job.title}</h3><p>{job.location} <span>·</span> {job.salary}</p><div className="tag-row">{job.skills.slice(0,5).map(s=><span className="skill-tag" key={s}>{s}</span>)}</div></div><div className="job-match"><div className="mini-score" style={{'--score':job.match+'%'}}><b>{analysis?job.match+'%':'—'}</b></div><small>skill match</small></div><button className="round-arrow" onClick={()=>setPage('analyze')}><ArrowUpRight size={18}/></button></div>)}</div>{!analysis&&<div className="empty-hint"><Sparkles size={18}/> Run your first resume analysis to calculate personalized job match percentages.</div>}</section>}
    {page==='roadmap'&&<Roadmap analysis={analysis} setPage={setPage}/>}
    {page==='history'&&<section><div className="page-heading"><div><div className="eyebrow">YOUR PROGRESS</div><h1>Analysis <span>history.</span></h1><p>Previous reports saved in this browser.</p></div>{history.length>0&&<button className="secondary-btn danger-btn" onClick={clearHistory}><Trash2 size={15}/> Clear history</button>}</div>{history.length===0?<div className="empty-state"><div className="empty-icon"><Clock3 size={28}/></div><h3>No saved analyses yet</h3><p>Your completed analyses will appear here when you save a report.</p><button className="primary-btn" onClick={()=>setPage('analyze')}>Start an analysis</button></div>:<div className="history-list">{history.map(h=><div className="history-row" key={h.id}><div className="history-file"><FileText size={19}/></div><div className="history-details"><b>{h.role}</b><span>{h.fileName} · {new Date(h.generatedAt).toLocaleString()}</span></div><strong style={{color:scoreColor(h.score)}}>{h.score}%</strong><button className="round-arrow" onClick={()=>{setAnalysis(h);setPage('overview')}}><ArrowUpRight size={17}/></button></div>)}</div>}</section>}
   </div>
   <footer>© 2026 TalentLens <span>Built for learning · AI-assisted career insights</span></footer>
  </main>
 </div>
}
function Overview({analysis,matchedJobs,setPage,savedCount,mode,runAnalysis,busy,saveReport,downloadReport}){
 if(!analysis)return <section><div className="welcome-banner"><div className="welcome-copy"><div className="eyebrow light">YOUR CAREER, WITH CLARITY</div><h1>Find your <i>next opportunity.</i></h1><p>Understand how your resume aligns with the role you want. Get clear, practical steps to move forward.</p><button className="white-btn" onClick={()=>setPage('analyze')}>Start resume analysis <ArrowUpRight size={17}/></button></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-document"><div className="doc-top"><span/><span/><span/></div><div className="doc-avatar"/><div className="doc-line wide"/><div className="doc-line"/><div className="doc-line short"/><div className="doc-divider"/><div className="doc-line wide"/><div className="doc-line"/><div className="doc-line short"/></div><div className="floating-score"><Sparkles size={15}/><b>92%</b><small>Profile strength</small></div><div className="floating-check"><CheckCircle2 size={19}/></div></div></div><div className="section-title-row"><div><h2>Your workspace</h2><p>A quick look at your career matching activity.</p></div><button className="text-btn" onClick={()=>setPage('analyze')}>New analysis <ArrowUpRight size={15}/></button></div><div className="stat-grid"><Stat icon={FileUser} label="Resumes analyzed" value="0" sub="Start with your first resume" color="violet"/><Stat icon={Target} label="Average match score" value="—" sub="Your score will appear here" color="blue"/><Stat icon={BriefcaseBusiness} label="Job matches" value="0" sub="Personalized role suggestions" color="green"/><Stat icon={Clock3} label="Saved reports" value={savedCount} sub="Stored on this device" color="amber"/></div><div className="bottom-grid"><div className="panel getting-started"><div className="panel-heading"><div><h3>Get started in 3 steps</h3><p>Your path to a more targeted application.</p></div><span className="tiny-badge">QUICK START</span></div><div className="start-step"><div className="step-number">01</div><div><b>Upload your resume</b><p>Add your latest resume in PDF or TXT format.</p></div><CheckCircle2 size={18}/></div><div className="start-step"><div className="step-number">02</div><div><b>Add a job description</b><p>Choose a role you want to target.</p></div><CheckCircle2 size={18}/></div><div className="start-step"><div className="step-number">03</div><div><b>Review your match insights</b><p>See strengths, skill gaps and next steps.</p></div><ArrowUpRight size={18}/></div><button className="primary-btn full" onClick={()=>setPage('analyze')}>Analyze my resume <ChevronRight size={17}/></button></div><div className="panel insight-card"><div className="insight-top"><div className="panel-icon purple"><BrainCircuit size={18}/></div><span className="tiny-badge">CAREER TIP</span></div><h3>Make your skills visible.</h3><p>Recruiters need evidence, not just a list of tools. Add project bullets that explain what you analyzed, which tools you used and what outcome you achieved.</p><div className="tip-example"><span>TRY THIS</span><b>“Analyzed 10,000+ records using Python and SQL to identify trends and build a Power BI dashboard.”</b></div></div></div></section>
 return <section><div className="page-heading"><div><div className="eyebrow">LATEST ANALYSIS · {mode==='gemini'?'GEMINI AI':'DEMO ENGINE'}</div><h1>Your match <span>report.</span></h1><p>{analysis.summary}</p></div><div className="heading-actions"><button className="secondary-btn" onClick={downloadReport}><Download size={16}/> Export</button><button className="primary-btn" onClick={()=>setPage('analyze')}><Plus size={16}/> New analysis</button></div></div><div className="report-grid"><div className="panel score-panel"><div className="panel-heading"><div><h3>Overall compatibility</h3><p>Based on skills detected in the resume and job description.</p></div><span className="tiny-badge">{mode==='gemini'?'AI ANALYSIS':'RULE-BASED'}</span></div><div className="score-content"><div className="score-ring" style={{'--score':analysis.score+'%','--ring':scoreColor(analysis.score)}}><div><b>{analysis.score}%</b><small>match score</small></div></div><div className="score-explain"><h3>{analysis.score>=75?'Strong alignment':analysis.score>=50?'Good foundation':'Growth opportunity'}</h3><p>{analysis.summary}</p><div className="legend"><span><i className="green-dot"/>Matched skills</span><span><i className="red-dot"/>Missing skills</span></div></div></div></div><div className="panel breakdown-panel"><div className="panel-heading"><div><h3>Skill breakdown</h3><p>What the role asks for.</p></div><Target size={18} className="muted"/></div><div className="breakdown-number"><b>{analysis.matched.length}</b><span>of {analysis.required.length} required skills found</span></div><div className="progress-track"><div style={{width:analysis.score+'%'}}/></div><div className="breakdown-meta"><span>Skill coverage</span><b>{analysis.score}%</b></div><div className="breakdown-meta"><span>Experience signal</span><b>{analysis.experience}%</b></div><div className="breakdown-meta"><span>Extra skills</span><b>{analysis.extras.length}</b></div></div></div><div className="panel skills-panel"><div className="panel-heading"><div><h3>Skills intelligence</h3><p>Skills identified from your resume and target job description.</p></div><button className="text-btn" onClick={()=>setPage('roadmap')}>View learning roadmap <ArrowUpRight size={15}/></button></div><div className="skills-columns"><div><div className="skill-heading"><CheckCircle2 size={16}/> Matched skills <span>{analysis.matched.length}</span></div><div className="skill-pills">{analysis.matched.length?analysis.matched.map(s=><span className="pill matched" key={s}>{s}<CheckCircle2 size={12}/></span>):<small className="muted">No direct matches detected yet.</small>}</div></div><div><div className="skill-heading missing"><CircleAlert size={16}/> Skills to develop <span>{analysis.missing.length}</span></div><div className="skill-pills">{analysis.missing.length?analysis.missing.map(s=><span className="pill missing-pill" key={s}>{s}<Plus size={12}/></span>):<small className="muted">No missing skills detected.</small>}</div></div><div><div className="skill-heading extra"><Zap size={16}/> Additional strengths <span>{analysis.extras.length}</span></div><div className="skill-pills">{analysis.extras.length?analysis.extras.map(s=><span className="pill extra-pill" key={s}>{s}</span>):<small className="muted">No additional skills detected.</small>}</div></div></div></div><div className="bottom-grid report-bottom"><div className="panel"><div className="panel-heading"><div><h3>Recommended opportunities</h3><p>Explore roles based on your current skills.</p></div><button className="text-btn" onClick={()=>setPage('jobs')}>All jobs <ArrowUpRight size={14}/></button></div>{matchedJobs.slice(0,3).map(j=><div className="compact-job" key={j.title}><div className="company-logo small-logo">{j.company[0]}</div><div><b>{j.title}</b><small>{j.company} · {j.location}</small></div><strong>{j.match}%</strong></div>)}</div><div className="panel next-panel"><div className="panel-icon blue"><GraduationCap size={19}/></div><h3>Turn gaps into growth.</h3><p>Get a focused learning plan for the skills that can improve your alignment.</p><button className="primary-btn full" onClick={()=>setPage('roadmap')}>Build my roadmap <ArrowUpRight size={15}/></button><button className="text-btn save-link" onClick={()=>saveReport(analysis)}><CheckCircle2 size={14}/> Save this report</button></div></div></section>
}
function Stat({icon:Icon,label,value,sub,color}){return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={18}/></div><span>{label}</span><b>{value}</b><small>{sub}</small></div>}
function Roadmap({analysis,setPage}){
 const gaps=analysis?.missing||['SQL window functions','Advanced Excel','Power BI DAX','Data storytelling']
 const steps=[{day:'DAY 01–02',title:`Build confidence in ${gaps[0]||'core skills'}`,desc:'Learn the fundamentals and complete one guided hands-on exercise.',icon:BookOpenCheck},{day:'DAY 03–04',title:`Practice ${gaps[1]||'a practical project'}`,desc:'Apply the concept to a small dataset and document your approach.',icon:Code2},{day:'DAY 05–06',title:'Create proof of work',desc:'Add a measurable project bullet, screenshots and a short explanation.',icon:ChartNoAxesCombined},{day:'DAY 07',title:'Review and communicate',desc:'Explain what you learned and practice role-specific interview questions.',icon:GraduationCap}]
 return <section><div className="page-heading"><div><div className="eyebrow">PERSONAL DEVELOPMENT PLAN</div><h1>Your skill <span>roadmap.</span></h1><p>A practical 7-day starter plan to strengthen your job alignment.</p></div><span className="step-chip"><Zap size={15}/> 7-day sprint</span></div><div className="roadmap-layout"><div className="panel roadmap-main"><div className="roadmap-intro"><div className="roadmap-icon"><GraduationCap size={23}/></div><div><h3>{analysis?'Your personalized learning sprint':'Your starter learning sprint'}</h3><p>{analysis?`Focus on ${gaps.length} missing skills identified in your latest analysis.`:'Run a resume analysis to personalize this plan to your skill gaps.'}</p></div></div><div className="timeline">{steps.map((s,i)=><div className="timeline-item" key={s.day}><div className="timeline-marker"><s.icon size={17}/></div><div className="timeline-copy"><span>{s.day}</span><h3>{s.title}</h3><p>{s.desc}</p></div><span className="task-count">{i===0?gaps.length+' topics':'1 milestone'}</span></div>)}</div></div><div className="panel gap-side"><div className="panel-icon purple"><Target size={18}/></div><h3>Your focus areas</h3><p>Prioritize skills that appear in the job description but are not yet visible in your resume.</p><div className="focus-list">{gaps.slice(0,6).map((s,i)=><div key={s}><span>{i+1}</span><b>{s}</b><small>{i<2?'High focus':'Build next'}</small></div>)}</div><button className="primary-btn full" onClick={()=>setPage('analyze')}>Update my analysis <ArrowUpRight size={15}/></button></div></div></section>
}
export default App
