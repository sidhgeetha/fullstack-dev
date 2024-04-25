//require express

const express = require("express");

//create anexpress application

const app = express();

//import middleware

const cors = require('cors');

const userRouter = require('./routes/userRoutes');

//use middleware

app.use(cors())

//parse the req body as Json
app.use(express.json());

//defien endpoints
app.use('/api/users', userRouter);




//export app
module.exports = app;

