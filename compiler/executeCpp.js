const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");


const outputPath = path.join(__dirname, "outputs");


if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true }); // This tells Node.js:If any parent folders in the path do not exist, create them too.If the directory already exists, do nothing (no error thrown).
}

const executeCpp = async (filePath, inputFilePath) => {
  const jobId = path.basename(filePath).split(".")[0];//will extract the unique string from the path
  const codesDir = path.dirname(filePath);
  const outputFilename = `${jobId}.exe`;
  const outPath = path.join(outputPath, outputFilename);

  const cmd = `cd "${codesDir}" && ` + `g++ "${jobId}.cpp" -o "${outPath}" && ` + `"${outPath}" < "${inputFilePath}"`
  return new Promise((resolve, reject) => {
    const start = Date.now();
    exec(cmd, (error, stdout, stderr) => {
      const end = Date.now();   // end time
      const timeTaken = end - start;
      if (error) {
        reject({ error, stderr });
      
      }
      if (stderr) {
        reject({ stderr });
      }
      resolve({
        output: stdout,
        time: timeTaken
      });
    })
  })
};

module.exports = executeCpp;
