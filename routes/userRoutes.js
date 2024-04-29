const express = require("express");

const userRouter = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

//endpoints
userRouter.post("/signup", userController.signup);
userRouter.post("/signin", userController.signin);

userRouter.get("/getUser", auth.verifyToken, userController.getUser);

module.exports = userRouter;
