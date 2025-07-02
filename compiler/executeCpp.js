const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");


const outputPath = path.join(__dirname, "outputs");


if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true }); // This tells Node.js:If any parent folders in the path do not exist, create them too.If the directory already exists, do nothing (no error thrown).
}

const executeCpp = async (filePath) => {
  const jobId = path.basename(filePath).split(".")[0];//will extract the unique string from the path
  const outputFilename = `${jobId}.exe`;
  const outPath = path.join(outputPath, outputFilename);
  

  return new Promise((resolve, reject) => {
    exec(`g++ "${filePath}" -o "${outPath}" && cd "${outputPath}" && ${outputFilename}`, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      }
      if (stderr) {
        reject({ stderr });
      }
      resolve(stdout);
    })
  })
};

module.exports = executeCpp;
