// import mongoose

const mongoose = require("mongoose");

const config = require("./utils/config");

console.log("connecting to MongoDB...");

const app = require("./app");


//connecting to MOongoDB

mongoose
  .connect(
   config.MONGODB_URL
  )
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(config.PORT, () => {
      console.log("server is running on port 3001");
    });
  })

  .catch((error) => {
    console.log("Connection failed", error.message);
  });
//index.js for db connectivity & application sever connectivity
