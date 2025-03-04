const express = require('express');
const app = express();
const cors = require('cors');

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCJuxnUgTGkUbRhcPng626vX3lBueA4Lz8");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

function formatGeminiResponse(response) {
    formattedResponse = response.replace(/([.!?])\s*(?=[A-Z])/g, '$1<br />');  // Add line breaks after sentences

    formattedResponse = formattedResponse.replace(/\*/g, '');  // remove all * from response

    return formattedResponse;
}

app.get("/:msg", async (req, res) => {
    try {
        const prompt = req.params.msg;

        const result = await model.generateContent(prompt);
        let response = formatGeminiResponse(result.response.text());
        return res.json(response);
    } catch (error) {
        console.error("Error generating text:", error);
    }
});

const port = process.env.PORT || 1111;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
