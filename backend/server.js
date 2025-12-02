// backend/server.js
// Simple Express API for the Digital Solutions IA1 Workbook Coach

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 3001;

if (!OPENAI_API_KEY) {
  console.warn("WARNING: OPENAI_API_KEY is not set. Set it in your .env file.");
}

/**
 * POST /api/chat
 * Body: { section: string, message: string, history?: [{role, content}] }
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { section, message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing 'message' in request body." });
    }

    const workbookSection = section || "Not specified";

    // System prompt keeps it aligned to IA1 and workbook structure
    const systemPrompt = `
You are an AI study coach for Year 11 Digital Solutions students in Queensland, Australia.
You support Unit 1: "Creating with code" and the IA1 Technical Proposal task.

You help students complete their DIGITAL WORKBOOK:
EXPLORE — problem, personas, existing solutions, impacts, success criteria
DEVELOP — data requirements, data story, DFD, ERD, UX requirements, programming requirements
GENERATE — prototypes, SQL, pseudocode, script

Important:
- DO NOT write responses they can copy.
- Give feedback, hints, questions, checklists.
- Encourage academic integrity.
- Use Australian English.

Current workbook section: ${workbookSection}.
    `.trim();

    const messages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return res.status(500).json({ error: "Error from OpenAI API" });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/", (req, res) => {
  res.send("Digital Solutions Workbook Coach API is running.");
});

app.listen(PORT, () => {
  console.log(`Workbook Coach backend running on port ${PORT}`);
});
