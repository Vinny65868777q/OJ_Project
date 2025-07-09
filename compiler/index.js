const express = require('express')
const app = express()
const generateFile = require("./generateFile");
const executeCpp = require("./executeCpp");
const executeJava = require("./executeJava");
const executePython = require("./executePython");
const cors = require('cors');
const generateInputFile = require('./generateInputFile')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/run", async (req, res) => {
    const { code, language = 'cpp', input = '' } = req.body; //if user doesnot mention any language the default to be considered is cpp
    if (code === undefined) {
        return res.status(400).json({ success: false, error: "Empty code body" });
    }

    try {
        const filePath = generateFile(code, language);
        const inputFilePath = generateInputFile(input);
        let output;

        if (language === 'cpp') {
            output = await executeCpp(filePath, inputFilePath);
        } else if (language === 'java') {
            output = await executeJava(filePath, inputFilePath);
        } else if (language === 'python') {
            output = await executePython(filePath, inputFilePath);
        } else {
            return res.status(400).json({ error: 'Unsupported language' });
        }
        res.json({
            output: output.output,
            time: output.time
        });
    } catch (err) {

        // in index.js catch:
        res.status(500).json({ error: err.error || 'Execution Error', stderr: err.stderr, time: err.time });

    }

});
const PORT = process.env.PORT || 3000;

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});

