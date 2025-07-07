const { simplifyStatement, generateHint } = require('../utils/geminiClient');

exports.simplify = async (req, res, next) => {

    try {
        const { statement } = req.body;
        
        if (!statement) return res.status(400).json({ error: 'statement required' });

        const simplified = await simplifyStatement(statement);
        res.json({ simplified });
    } catch (err) {
        next(err);
    }
};

exports.hint = async (req, res, next) => {
    try {
        const { problem, code = '' } = req.body;
        
        if (!problem) return res.status(400).json({ error: 'problem required' });

        const hint = await generateHint(problem, code);
        res.json({ hint });

    } catch (err) {
        next(err);
    }
};