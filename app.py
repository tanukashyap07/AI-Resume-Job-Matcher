import json
import os
import re
from datetime import datetime, timezone
from typing import Any

import streamlit as st


st.set_page_config(
    page_title="TalentLens - AI Resume Matcher",
    page_icon=":dart:",
    layout="wide",
)

SAMPLE_RESUME = """TANU KASHYAP
Data Analyst | Python | SQL | Excel | Power BI
SKILLS
Python, SQL, MySQL, Excel, Power BI, Pandas, NumPy, Matplotlib, Data Cleaning, Dashboard Development, Statistics, Communication
PROJECTS
Indian Railways EDA - cleaned and analyzed journey data using Python, Pandas and NumPy; built a Power BI dashboard.
EDUCATION
Bachelor of Computer Applications (Artificial Intelligence), 2027"""

SAMPLE_JOB = """Junior Data Analyst. Required skills:
- Strong SQL including joins and window functions
- Python with Pandas and NumPy
- Advanced Excel
- Power BI dashboard development and data visualization
- Data cleaning and statistics
- Good communication and problem-solving
Preferred: MySQL, data storytelling."""

SKILL_BANK = [
    "python", "sql", "mysql", "excel", "power bi", "tableau", "pandas",
    "numpy", "matplotlib", "seaborn", "statistics", "data cleaning",
    "data visualization", "dashboard development", "machine learning",
    "communication", "problem-solving", "aws", "azure", "tensorflow",
    "scikit-learn", "javascript", "react", "mongodb", "postgresql",
    "window functions", "data storytelling", "etl", "git", "linux",
    "deep learning", "nlp", "java", "c++", "c#", "typescript", "html",
    "css", "node.js", "django", "spring boot", "docker", "kubernetes",
    "rest api", "restful api", "microservices", "agile", "scrum", "ci/cd",
    "testing", "debugging", "code review", "redis", "graphql",
]

JOBS = [
    {
        "title": "Junior Data Analyst",
        "company": "Northstar Analytics",
        "location": "Noida - Hybrid",
        "salary": "INR 3.5-5.5 LPA",
        "skills": ["sql", "python", "excel", "power bi", "pandas", "statistics", "data visualization"],
    },
    {
        "title": "Business Intelligence Intern",
        "company": "MetricFlow",
        "location": "Remote - India",
        "salary": "INR 15k-25k / month",
        "skills": ["power bi", "sql", "excel", "data storytelling", "dashboard development"],
    },
    {
        "title": "Python Data Analyst",
        "company": "InsightWorks",
        "location": "Bengaluru - Hybrid",
        "salary": "INR 4-6 LPA",
        "skills": ["python", "sql", "pandas", "numpy", "matplotlib", "etl"],
    },
    {
        "title": "MIS Executive",
        "company": "Vertex Operations",
        "location": "Delhi NCR - On-site",
        "salary": "INR 2.8-4 LPA",
        "skills": ["excel", "sql", "communication", "dashboard development"],
    },
    {
        "title": "Full Stack Developer",
        "company": "Stackline",
        "location": "Remote - India",
        "salary": "INR 7-14 LPA",
        "skills": ["react", "node.js", "javascript", "mongodb", "rest api", "git", "docker"],
    },
]


def extract_skills(text: str) -> list[str]:
    lowered = text.lower()
    found = []
    for skill in SKILL_BANK:
        pattern = rf"(?<![a-z0-9]){re.escape(skill)}(?:s|es)?(?![a-z0-9])"
        if re.search(pattern, lowered):
            found.append(skill)
    return found


def demo_analysis(resume: str, job_description: str) -> dict[str, Any]:
    resume_skills = extract_skills(resume)
    required = extract_skills(job_description)
    matched = [skill for skill in required if skill in resume_skills]
    missing = [skill for skill in required if skill not in resume_skills]
    extras = [skill for skill in resume_skills if skill not in required]
    role_match = re.search(
        r"(?:junior |senior )?(?:data analyst|business analyst|software developer|"
        r"software engineer|full stack developer|developer|machine learning engineer)",
        job_description,
        re.IGNORECASE,
    )
    return {
        "score": min(98, round(len(matched) / max(len(required), 1) * 100)),
        "matched": matched,
        "missing": missing,
        "extras": extras,
        "required": required,
        "experience": 72 if re.search(r"experience|years|internship|worked", resume, re.I) else 48,
        "title": role_match.group(0) if role_match else "Target role",
        "summary": (
            f"Your resume shows {len(matched)} of {len(required)} skills this job asks for. "
            "Close the gaps and add measurable project results."
            if required
            else "No known skills were found in this job description. Try pasting the full job post."
        ),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
    }


def gemini_analysis(resume: str, job_description: str, api_key: str, model: str) -> dict[str, Any]:
    from google import genai

    client = genai.Client(api_key=api_key)
    prompt = f"""Analyze the resume against the job description.
Return only valid JSON with these keys:
score (0-100 number), matched (string array), missing (string array),
extras (string array), required (string array), experience (0-100 number),
title (string), summary (string).
Do not invent experience or qualifications.

RESUME:
{resume[:14000]}

JOB DESCRIPTION:
{job_description[:10000]}"""
    response = client.models.generate_content(model=model, contents=prompt)
    raw = (response.text or "").replace("```json", "").replace("```", "").strip()
    result = json.loads(raw)
    if not isinstance(result.get("score"), (int, float)):
        raise ValueError("Gemini returned an invalid score.")
    for key in ("matched", "missing", "extras", "required"):
        if not isinstance(result.get(key), list):
            raise ValueError(f"Gemini returned an invalid {key} value.")
    result["generatedAt"] = datetime.now(timezone.utc).isoformat()
    return result


def read_uploaded_file(uploaded_file: Any) -> str:
    if uploaded_file.name.lower().endswith(".pdf"):
        from pypdf import PdfReader

        reader = PdfReader(uploaded_file)
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    return uploaded_file.getvalue().decode("utf-8", errors="replace")


def pill_list(items: list[str], empty: str = "None") -> None:
    st.write(", ".join(items) if items else empty)


if "history" not in st.session_state:
    st.session_state.history = []
if "resume" not in st.session_state:
    st.session_state.resume = ""
if "job_description" not in st.session_state:
    st.session_state.job_description = ""
if "analysis" not in st.session_state:
    st.session_state.analysis = None

st.title("TalentLens")
st.caption("AI-powered resume-to-job description matching")

with st.sidebar:
    st.header("Input")
    uploaded_file = st.file_uploader("Upload resume", type=["txt", "pdf"])
    if uploaded_file and st.button("Load uploaded resume", use_container_width=True):
        try:
            st.session_state.resume = read_uploaded_file(uploaded_file)
            st.success("Resume loaded.")
        except ImportError:
            st.error("PDF support requires the pypdf package.")
        except Exception as error:
            st.error(f"Could not read the file: {error}")
    if st.button("Use sample data", use_container_width=True):
        st.session_state.resume = SAMPLE_RESUME
        st.session_state.job_description = SAMPLE_JOB
        st.success("Sample resume and job description loaded.")

    st.divider()
    api_key = st.secrets.get("GEMINI_API_KEY", os.getenv("GEMINI_API_KEY", ""))
    use_gemini = st.checkbox("Use Gemini AI", value=bool(api_key), disabled=not bool(api_key))
    if not api_key:
        st.caption("Demo mode is active. Add GEMINI_API_KEY in Streamlit secrets to enable AI mode.")

resume = st.text_area("Resume text", value=st.session_state.resume, height=260, key="resume_editor")
job_description = st.text_area(
    "Job description",
    value=st.session_state.job_description,
    height=220,
    key="job_editor",
)
st.session_state.resume = resume
st.session_state.job_description = job_description

if st.button("Analyze resume", type="primary", use_container_width=True):
    if not resume.strip() or not job_description.strip():
        st.error("Please add both your resume and a job description.")
    else:
        with st.spinner("Analyzing..."):
            try:
                if use_gemini and api_key:
                    result = gemini_analysis(
                        resume,
                        job_description,
                        api_key,
                        st.secrets.get("GEMINI_MODEL", os.getenv("GEMINI_MODEL", "gemini-2.5-flash")),
                    )
                    result["mode"] = "Gemini AI"
                else:
                    result = demo_analysis(resume, job_description)
                    result["mode"] = "Demo"
                st.session_state.analysis = result
            except Exception as error:
                st.error(f"AI analysis failed: {error}")

analysis = st.session_state.analysis
if analysis:
    st.divider()
    st.subheader(f"{analysis.get('title', 'Analysis')} - {analysis['mode']}")
    score = int(analysis["score"])
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Match score", f"{score}%")
    col2.metric("Matched skills", len(analysis["matched"]))
    col3.metric("Missing skills", len(analysis["missing"]))
    col4.metric("Experience signal", f"{analysis.get('experience', 0)}%")
    st.progress(max(0, min(score, 100)) / 100)
    st.info(analysis["summary"])

    left, right = st.columns(2)
    with left:
        st.markdown("#### Matched skills")
        pill_list(analysis["matched"])
        st.markdown("#### Missing skills")
        pill_list(analysis["missing"])
    with right:
        st.markdown("#### Additional resume skills")
        pill_list(analysis["extras"])
        st.markdown("#### Required skills detected")
        pill_list(analysis["required"])

    st.subheader("Recommended job matches")
    resume_skills = set(analysis["matched"] + analysis["extras"])
    ranked_jobs = []
    for job in JOBS:
        matched_job_skills = [skill for skill in job["skills"] if skill in resume_skills]
        ranked_jobs.append((len(matched_job_skills) / len(job["skills"]), job, matched_job_skills))
    for ratio, job, matched_job_skills in sorted(ranked_jobs, reverse=True, key=lambda item: item[0]):
        with st.container(border=True):
            st.markdown(f"**{job['title']}** - {job['company']}  \n{job['location']} | {job['salary']}")
            st.write(f"Match: **{round(ratio * 100)}%** | Skills: {', '.join(matched_job_skills) or 'None'}")

    report = json.dumps(
        {"resume": resume, "jobDescription": job_description, "analysis": analysis},
        indent=2,
    )
    col_save, col_download = st.columns(2)
    if col_save.button("Save to session history", use_container_width=True):
        st.session_state.history.insert(
            0,
            {
                **analysis,
                "fileName": uploaded_file.name if uploaded_file else "Pasted resume",
                "savedAt": datetime.now(timezone.utc).isoformat(),
            },
        )
        st.success("Analysis saved for this session.")
    col_download.download_button(
        "Download JSON report",
        data=report,
        file_name="talentlens-analysis.json",
        mime="application/json",
        use_container_width=True,
    )

if st.session_state.history:
    st.divider()
    st.subheader("Analysis history")
    for item in st.session_state.history:
        st.write(f"**{item.get('title', 'Target role')}** - {item['score']}% - {item['fileName']}")
