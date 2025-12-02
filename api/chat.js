export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { section, message, history } = req.body;

  const systemPrompt = `
You are an AI study coach for Year 11 Digital Solutions students in Queensland.
You support Unit 1: Creating with code and the IA1 Technical Proposal.
Provide feedback, hints, questions, and checklists only.
Never generate full assessment responses.
Use Australian English.
Current workbook section: ${section}.
  `.trim();

  const messages = [
    { role: "system", content: systemPrompt },
    ...(history || []),
    { role: "user", content: message }
  ];

  try {
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

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "No response generated.";

    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error contacting OpenAI" });
  }
}
