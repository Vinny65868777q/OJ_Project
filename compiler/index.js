const express = require('express')
const app = express()
const generateFile = require("./generateFile");
const executeCpp = require("./executeCpp");
const executeJava = require("./executeJava");
const executePython = require("./executePython");
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/run", async (req, res) => {
    const { code, language = 'cpp' } = req.body; //if user doesnot mention any language the default to be considered is cpp
    if (code === undefined) {
        return res.status(400).json({ success: false, error: "Empty code body" });
    }

    try {
        const filePath = generateFile(code, language);
        let output;

        if (language === 'cpp') {
            output = await executeCpp(filePath);
        } else if (language === 'java') {
            output = await executeJava(filePath);
        } else if (language === 'python') {
            output = await executePython(filePath);
        } else {
            return res.status(400).json({ error: 'Unsupported language' });
        }
        res.json({ success:true, output });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }

});

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});

