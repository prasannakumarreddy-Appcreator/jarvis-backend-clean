import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ai", async (req, res) => {
    try {
        const userText = req.body.text;

        if (!userText) {
            return res.status(400).json({ error: "No input text" });
        }

        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                input: userText
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenAI error:", data);
            return res.status(500).json({ error: "OpenAI API error", details: data });
        }

        const reply =
            data.output_text ||
            data.output?.[0]?.content?.[0]?.text ||
            "No response";

        res.json({ reply });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Server crashed" });
    }
});

app.listen(3000, () => {
    console.log("✅ Server running at http://localhost:3000");
});
