import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.0-pro"
    });

    const result = await model.generateContent(message);

    const text = result.response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ message: "AI failed" });
  }
};