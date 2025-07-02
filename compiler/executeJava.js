const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

const executeJava = async (filePath) => {

  
  const jobId = path.basename(filePath).split(".")[0];
  const outputFileName = `${jobId}.java`;
  const outPath = path.join(outputPath, outputFileName);

 fs.copyFileSync(filePath, outPath);

  const runCommand = `java "${outPath}"`;

  return new Promise((resolve, reject) => {
    exec(runCommand, (error, stdout, stderr) => {
      if (error) return reject({ error: "Execution Error", stderr: error.message });
      if (stderr) return reject({ error: "Runtime Error", stderr });
      resolve(stdout);
    });
  });
};

module.exports = executeJava;
