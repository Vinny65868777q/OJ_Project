// compiler/executePython.js
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

const executePython = async (filePath, inputFilePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outputFileName = `${jobId}.py`;
  const outPath = path.join(outputPath, outputFileName);
  // Move the file into outputs/ directory 
  fs.copyFileSync(filePath, outPath);

  const runCommand = `python "${outPath}"`;

  return new Promise((resolve, reject) => {
    const start = Date.now();
    exec(`${runCommand} <  "${inputFilePath}"`, (error, stdout, stderr) => {
      const end = Date.now();   // end time
      const timeTaken = end - start;
      if (error) return reject({ error: "Execution Error", stderr: error.message });
      if (stderr) return reject({ error: "Runtime Error", stderr });
      resolve({
        output: stdout,
        time: timeTaken
      });

    });
  });
};

module.exports = executePython;
