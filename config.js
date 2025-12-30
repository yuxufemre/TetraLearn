require('dotenv').config();

const config = {
    geminiApiKey: process.env.GEMINI_API_KEY,
    googleScriptUrl: process.env.GOOGLE_SCRIPT_URL
};

module.exports = config;
