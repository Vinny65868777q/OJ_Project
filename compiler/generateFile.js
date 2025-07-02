const fs  = require("fs") //helps you interact with the file system
const path =  require("path")//provide the path of any file
const {v4: uuid} = require("uuid");


//This will create a folder called codes/ in the current directory if it doesn't exist already.
const dirCodes = path.join(__dirname,"codes");

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{recursive:true}); // This tells Node.js:If any parent folders in the path do not exist, create them too.If the directory already exists, do nothing (no error thrown).
}

const extMap = {
  cpp: "cpp",
  python: "py",
  java: "java"
};

const generateFile = ( code, language) =>{
const jobId = uuid();//will generate the unique string
const extension = extMap[language] || "txt";
const fileName = `${jobId}.${extension}`;
const filePath = path.join(dirCodes,fileName);
fs.writeFileSync(filePath,code);//add the code in this file path
return filePath; // will return in the frontend. Also can be seen inside the codes folder.
};

module.exports = generateFile;