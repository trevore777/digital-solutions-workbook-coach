# Digital Solutions IA1 Workbook Coach

A lightweight AI helper for Year 11 Digital Solutions (QCAA Unit 1: Creating with code).

Students paste their drafts into the chat, and the AI gives:
- Feedback
- Hints
- Checklists
- Questions to improve thinking

It **never** produces full assessment answers.

---

# 🚀 Deployment Guide

## 1. Deploy Backend on Render

1. Push this repo to GitHub.
2. Go to https://render.com
3. Create a **Web Service**
4. Root folder: `backend`
5. Build command: `npm install`
6. Start command: `node server.js`
7. Add Environment Variable `OPENAI_API_KEY`
8. Deploy
9. Get your backend URL (example):

https://ds-workbook-backend.onrender.com


## 2. Deploy Frontend on Vercel

1. Go to https://vercel.com
2. Import this GitHub repo
3. Set **Root Directory** = `frontend`
4. Build command: *leave empty*
5. Output Directory: `.`
6. Deploy
7. Update the `API_URL` in `frontend/index.html` with your Render backend URL.

## 3. Embed in Compass

Add your Vercel URL as a school resource:


---

# 🔒 Safety

- API key stays server-side.
- Students cannot access OpenAI directly.
- School blocks on ChatGPT do NOT affect this tool.

