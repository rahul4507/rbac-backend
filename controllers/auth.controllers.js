const User = require("./../models/user.models");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config({ path: "./config.env" });

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and password are required",
      });
    }

    // Find user and select the password field explicitly
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    // Generate JWT token
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);
    console.log(user);
    const token = jwt.sign(
      { id: user._id, type: user.type }, // Payload: Data to be encoded into the token
      process.env.JWT_SECRET, // Secret key: Used to sign the token (it must be kept secret)
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" } // Options: Token expiration time
    );

    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);

    // Exclude password from the response
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error, please try again later",
    });
  }
};

exports.logout = (req, res) => {
  // A logout operation in a JWT-based system is usually done by removing the token
  // from the client side (like localStorage or cookies). On the server side,
  // we don't need to do much unless you implement token blacklisting or store the sessions.

  // If you're storing JWT in cookies (e.g., HTTPOnly cookies), you could clear the cookie here.
  res.clearCookie("jwt"); // Clear the cookie, if you're using cookies to store JWT

  // Send a response to confirm the logout
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};
