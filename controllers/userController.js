const User = require("../models/user"); // Corrected import
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../utils/config");
const userController = {
  signup: async (request, response) => {
    try {
      // Get user input
      const { username, password, name } = request.body;

      // Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return response.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
        username,
        passwordHash,
        name,
      });

      // Save user to database
      const savedUser = await newUser.save();

      // Return saved user
      response.json({ message: "User created", user: savedUser });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },



  signin: async (request, response) => {
    try {
      // Get username and password from request body
      const { username, password } = request.body;

      // Check if user exists in DB
      const user = await User.findOne({ username });

      // If user does not exist
      if (!user) {
        return response.status(400).json({ message: "User not found" });
      }

      // If user exists, check if the password is correct
      const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

      // If password is not correct
      if (!passwordCorrect) {
        return response.status(400).json({ message: "Invalid password" });
      }

      // If password is correct, generate token
      const token = jwt.sign(
        {
          username: user.username,
          id: user._id,
          name: user.name,
        },
        config.JWT_SECRET
      );

      // Return token
      response.json({ message: "User logged in", token });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
