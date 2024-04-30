// const User = require("../models/user"); // Corrected import
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const config = require("../utils/config");
// const userController = {
//   signup: async (request, response) => {
//     try {
//       // Get user input
//       const { username, password, name } = request.body;

//       // Check if user exists
//       const existingUser = await User.findOne({ username });
//       if (existingUser) {
//         return response.status(400).json({ message: "User already exists" });
//       }

//       // Hash the password
//       const passwordHash = await bcrypt.hash(password, 10);

//       // Create new user
//       const newUser = new User({
//         username,
//         passwordHash,
//         name,
//       });

//       // Save user to database
//       const savedUser = await newUser.save();

//       // Return saved user
//       response.json({ message: "User created", user: savedUser });
//     } catch (error) {
//       response.status(500).json({ message: error.message });
//     }
//   },

//   signin: async (request, response) => {
//     try {
//       // Get username and password from request body
//       const { username, password } = request.body;

//       // Check if user exists in DB
//       const user = await User.findOne({ username });

//       // If user does not exist
//       if (!user) {
//         return response.status(400).json({ message: "User not found" });
//       }

//       // If user exists, check if the password is correct
//       const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

//       // If password is not correct
//       if (!passwordCorrect) {
//         return response.status(400).json({ message: "Invalid password" });
//       }

//       // If password is correct, generate token
//       const token = jwt.sign(
//         {
//           username: user.username,
//           id: user._id,
//           name: user.name,
//         },
//         config.JWT_SECRET
//       );

//       // Return token
//       response.json({ message: "User logged in", token });
//     } catch (error) {
//       response.status(500).json({ message: error.message });
//     }
//   },

//   getUser: async (request, response) => {
//     try {
//       //get user id from request
//       const userId = request.userId;

//       //get user from db
//       const user = await User.findById(userId);

//       //return user
//       response.json({ message: "User found " , user});
//     } catch (error) {
//       response.status(500).json({ message: error.message });
//     }
//   },
// };

// module.exports = userController;

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../utils/config");

const userController = {
  signup: async (request, response) => {
    try {
      const { username, password, name } = request.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return response.status(400).json({ error: "User already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        passwordHash,
        name,
      });

      const savedUser = await newUser.save();

      response.json({ message: "User created", user: savedUser });
    } catch (error) {
      response.status(500).json({ error: "Internal server error" });
    }
  },

  signin: async (request, response) => {
    try {
      const { username, password } = request.body;

      const user = await User.findOne({ username });

      if (!user) {
        return response.status(400).json({ error: "Invalid credentials" });
      }

      const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

      if (!passwordCorrect) {
        return response.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          username: user.username,
          id: user._id,
          name: user.name,
        },
        config.JWT_SECRET
      );
      //create cookie with token

      response.cookie("token", token, {
        httpOnly: true,
        sameDate: "strict",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //24 hours from now
        secure: true,
      });

      response.json({ message: "User logged in", token });
    } catch (error) {
      response.status(500).json({ error: "Internal server error" });
    }
  },

  getUser: async (request, response) => {
    try {
      const userId = request.userId;

      const user = await User.findById(userId).select("-passwordHash");

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }

      response.json({ message: "User found", user });
    } catch (error) {
      response.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = userController;
