const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

const executeJava = async (filePath, inputFilePath) => {

  
  const jobId = path.basename(filePath).split(".")[0];
  const outputFileName = `${jobId}.java`;
  const outPath = path.join(outputPath, outputFileName);

 fs.copyFileSync(filePath, outPath);

  const runCommand = `java "${outPath}"`;

  return new Promise((resolve, reject) => {
    const start = Date.now();
    exec(`${runCommand}  < "${inputFilePath}"`, (error, stdout, stderr) => {
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

module.exports = executeJava;
