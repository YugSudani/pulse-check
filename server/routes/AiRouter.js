const express = require("express");
const router = express.Router();

// Groq API - Free, fast, 30 requests/minute
// Get your free API key at: https://console.groq.com/keys
const GROQ_API_KEY = process.env.GROQ_API_KEY;

router.post("/summarizeText", async (req, res) => {
  try {
    const text = req.body.text;

    if (!GROQ_API_KEY) {
      return res.json({
        status: "fail",
        output_summary:
          "GROQ_API_KEY not configured. Get free key at https://console.groq.com/keys",
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: `You are analyzing server uptime monitoring logs. Each entry contains: responseTime (ms), status (UP/DOWN), and checkedAt timestamp.

Analyze this data and provide a plain text summary (NO markdown, NO bullet symbols, NO asterisks):
- Overall health summary with uptime percentage and average response time
- Any performance issues or downtime incidents detected
- Quick recommendation if needed

Keep response under 100 words. Use points. Data:
${text}`,
            },
          ],
          max_tokens: 300,
          temperature: 0.3,
        }),
      },
    );

    const data = await response.json();
    console.log("🤖 Groq Response received");

    if (data.choices && data.choices[0]) {
      res.json({ status: "ok", output_summary: data });
    } else {
      res.json({
        status: "fail",
        output_summary: data.error?.message || "AI request failed",
      });
    }
  } catch (error) {
    console.error("AI Router Error:", error.message);
    res.json({ status: "fail", output_summary: error.message });
  }
});

module.exports = router;
