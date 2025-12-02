// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    // Allow you to test quickly in a browser
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { section, message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing 'message' in body." });
    }

    const systemPrompt = `
You are an AI study coach for Year 11 Digital Solutions students in Queensland.
You support Unit 1: Creating with code and the IA1 Technical Proposal.
You help them complete their DIGITAL WORKBOOK:
- Explore: problem, personas, existing solutions, impacts, success criteria
- Develop: data story, data requirements, DFD, ERD, UX & programming requirements
- Generate: prototype screens, pseudocode/SQL, script & slides.

Important:
- Do NOT write full responses they can copy.
- Give feedback, questions, hints, and checklists.
- Use Australian English.
Current workbook section: ${section || "not specified"}.
    `.trim();

    const messages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI API error:", text);
      return res.status(500).json({ error: "OpenAI API error", detail: text });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
