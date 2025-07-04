const fs  = require("fs") //helps you interact with the file system
const path =  require("path")//provide the path of any file
const {v4: uuid} = require("uuid");


//This will create a folder called codes/ in the current directory if it doesn't exist already.
const dirInputs = path.join(__dirname,"inputs");

if(!fs.existsSync(dirInputs)){
    fs.mkdirSync(dirInputs,{recursive:true}); // This tells Node.js:If any parent folders in the path do not exist, create them too.If the directory already exists, do nothing (no error thrown).
}


const generateInputFile = (input) =>{
   const jobId = uuid();
   const InputfileName = `${jobId}.txt`;
   const InputfilePath = path.join(dirInputs, InputfileName);
   fs.writeFileSync(InputfilePath,input);
   return InputfilePath; 

};

module.exports = generateInputFile;