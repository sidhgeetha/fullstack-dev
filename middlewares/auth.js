const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const auth = {
  verifyToken: (request, response, next) => {
    try {
      // Get the token from request headers
      const token = request.headers.authorization;

      //if token is missing, return error
      if (!token) {
        return response.status(400).json({ error: "Token missing" });
      }

      const getToken = (token) => {
        if (token && token.toLowerCase().startsWith("bearer ")) {
          return token.substring(7);
        }
        return null;
      };

      // Verify token
      try {
        const decodedToken = jwt.verify(getToken(token), config.JWT_SECRET);

        // Add decoded token to request for further use
        request.userId = decodedToken.id;
        next();
      } catch (error) {
        return response.status(401).json({ error: "Invalid token" });
      }
    } catch (error) {
      response.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = auth;
