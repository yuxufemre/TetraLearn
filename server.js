const express = require('express');
const cors = require('cors');
const config = require('./config');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = config.geminiApiKey;
const GOOGLE_SCRIPT_URL = config.googleScriptUrl;

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Mesaj boş olamaz.' });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
        const systemInstruction = "Sen TetraLearn asistanısın. Konuları eğlenceli anlat. Türkçe cevap ver.";

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: systemInstruction }] }
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Google API Hatası');

        res.json({ reply: data.candidates[0].content.parts[0].text });

    } catch (error) {
        console.error('Chat Hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const formData = req.body;

        if (GOOGLE_SCRIPT_URL.includes("BURAYA_GOOGLE")) {
            return res.status(500).json({ result: 'error', error: 'Sunucuda Google Script URL tanımlanmamış!' });
        }

        const params = new URLSearchParams();
        params.append('name', formData.name);
        params.append('email', formData.email);
        params.append('message', formData.message);

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: params
        });

        const result = await response.json();
        res.json(result);

    } catch (error) {
        console.error('Form Hatası:', error);
        res.status(500).json({ result: 'error', error: 'Form gönderilirken sunucu hatası oluştu.' });
    }
});

app.listen(PORT, () => {
    console.log(`Güvenli sunucu çalışıyor: http://localhost:${PORT}`);
});
