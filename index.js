// import mongoose

const mongoose = require("mongoose");

console.log("connecting to MongoDB...");

const app=require('./app');
//connecting to MOongoDB

mongoose
  .connect(
    "mongodb+srv://sidhgeetha:guvi2023@cluster0.gts1nzk.mongodb.net/FULLSTACK-DEV-DB"
  )
  .then(() => {
    console.log("connected to MongoDB");
     app.listen(3001, ()=>{
        console.log("server is running on port 3001")
     });
  })

 
  .catch((error) => {
    console.log("Connection failed", error.message);
  });
//index.js for db connectivity & application sever connectivity


