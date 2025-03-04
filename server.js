const express = require('express');
const app = express();
const cors = require('cors');

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCJuxnUgTGkUbRhcPng626vX3lBueA4Lz8");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

function formatGeminiResponse(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text* -> <em>text</em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Line breaks: \n\n -> <br> (or you could use <p> tags for paragraphs)
    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/\n/g, '<br>');
    
    // remove all * from response
    text = text.replace(/\*/g, ''); 

    return text;
}

app.get("/:msg", async (req, res) => {
    try {
        const prompt = req.params.msg;

        const result = await model.generateContent(prompt);
        console.log("result===", result)
        console.log("text===", result.response.text())
        let response = formatGeminiResponse(result.response.text());
        return res.json(response);
    } catch (error) {
        console.error("Error generating text:", error);
        return res.json({status: false});
    }
});

const port = process.env.PORT || 1111;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
