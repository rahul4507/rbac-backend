const jwt = require("jsonwebtoken");

// Middleware to check JWT token
const protect = (req, res, next) => {
  // Check if token is provided in the Authorization header
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "You are not logged in! Please log in to get access.",
    });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid or expired token.",
      });
    }

    // Add the decoded token data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = protect;
