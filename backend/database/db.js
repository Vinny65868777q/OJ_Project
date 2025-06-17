const mongoose = require('mongoose')

const DBConnection = async() =>{
    const MONGO_URI = process.env.MONGODB_URL;
    try{
       await mongoose.connect(MONGO_URI);
       console.log("DB Connection established");
    }catch(error){
        console.log("Error while connecting to MongoDB",error);
    }
};

module.exports = {DBConnection};//we use an object — it lets us send multiple tools out of one file.
