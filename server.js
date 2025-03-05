const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require ("node-fetch")
globalThis.fetch = fetch;
globalThis.Headers = fetch.Headers;

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const modelConfig = {
    model: "gemini-2.0-flash",
    temperature: 0.8,
    maxTokens: 64,
    safetySettings: [
      {
        // Block all sexually explicit content
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        // Block all hate speech
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        // Allow medium+ dangerous content
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        // Allow high harrassment
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  };
  
const model = genAI.getGenerativeModel(modelConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/:msg", async (req, res) => {
    try {
        const prompt = req.params.msg;

        let result = await model.generateContent(prompt);
        let response = result.response.text();
        return res.json(response.replace(/\*/g, '' ));
    } catch (error) {
        console.error("Error generating text:", error);
        return res.json({status: false});
    }
});

const port = process.env.PORT || 1111;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});