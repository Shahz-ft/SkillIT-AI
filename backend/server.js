import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
console.log(process.env.OPENROUTER_API_KEY?.slice(0, 10));

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
// Test Route
app.get("/", (req, res) => {
  res.send("Skill'IT AI Backend Running 🚀");
});

// Ask AI Route
app.post("/ask-ai", async (req, res) => {
  try {
    const { tool, prompt } = req.body;

    let finalPrompt = prompt;
    if (tool === "quiz") {
      finalPrompt = `
Generate exactly 5 multiple-choice questions on the topic:

${prompt}

IMPORTANT:
Return ONLY a valid JSON array.

Example:

[
  {
    "question": "What is React?",
    "options": [
      "JavaScript Library",
      "Database",
      "Programming Language",
      "Operating System"
    ],
    "answer": "JavaScript Library"
  }
]

Rules:
- Exactly 5 questions.
- Exactly 4 options.
- "answer" must exactly match one option.
- No explanations.
- No markdown.
- No headings.
- No extra text before or after the JSON.
`;
    }

    if (tool === "flashcards") {
      finalPrompt = `
Generate exactly 10 flashcards on the topic:

${prompt}

Return ONLY valid JSON.

Format:

[
  {
    "question": "What is React?",
    "answer": "React is a JavaScript library for building user interfaces."
  }
]

Rules:
- Exactly 10 flashcards.
- Simple English.
- Short answers (1-2 sentences).
- No markdown.
- No explanations.
- No extra text.
- Return JSON only.
`;
    }

    if (tool === "summary") {
      finalPrompt = `
Summarize these notes.

Rules:
- Use bullet points.
- Keep only the important ideas.
- Use simple English.
- Don't copy the notes word-for-word.
- End with one study tip.

Notes:

${prompt}
`;
    }
    const completion = await client.chat.completions.create({
      model: "openrouter/free",

      max_tokens: 800,

      messages: [
        {
          role: "system",
          content: `You are Skill'IT AI, an intelligent study assistant.

Rules:
- Explain in very simple English.
- Be friendly and encouraging.
- Follow the user's instruction exactly.
- Do NOT use Markdown.
- Do NOT use ## headings.
- Do NOT use **bold** text.
- Do NOT use triple backticks (\`\`\`).
- Use short paragraphs.
- Use bullet points only when needed.
- Keep responses under 180 words unless the user asks for a detailed explanation.
- Give one simple real-life example whenever possible.
- End with one short study tip.
`,
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
    });
    console.log(completion.choices[0].message.content);
    res.json({
      answer: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Something went wrong.",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
