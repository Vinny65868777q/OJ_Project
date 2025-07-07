const { GoogleGenerativeAI } = require('@google/generative-ai');
const problems = require('../models/problems');

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing');
}

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: 'gemini-2.0-flash' });

// --- helpers ------------------------------------------------------------

const simplifyStatement = async (statement) => {
    const res = await gemini.generateContent(`You are a programming tutor for absolute beginners.

Simplify the following problem description using plain, beginner-friendly language. 
Explain what the problem is asking.
Do NOT include code or solutions.
Use analogies or real-world examples if helpful.: ${statement}`);
    const text = res.response.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not simplify the statement.';
    return text;
   
};

const generateHint = async (problems, userCode = '') => {

    const prompt = `Provide a concise hint(no full solution) for this problem.` + `Problem: ${problems}` +
        (userCode ? `

User's current code:
${userCode}` : '');

    const res = await gemini.generateContent(prompt);
    return res.response.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not simplify the statement.';;
};

module.exports = { simplifyStatement, generateHint };


