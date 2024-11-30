const bcrypt = require("bcryptjs"); // Add bcrypt import
const User = require("./../models/user.models");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, phone, date_of_birth, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !date_of_birth || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "User with this email already exists",
      });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new admin user
    const newUser = await User.create({
      name,
      email,
      phone,
      date_of_birth,
      password: password,
      type: "Admin",
    });

    // Exclude password from response
    newUser.password = undefined;

    // Send response
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    // Log error for debugging
    console.error("Error during admin registration:", err);

    // Handle specific error cases
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "fail",
        message: "Validation error: " + err.message,
      });
    }

    // General error response
    res.status(500).json({
      status: "error",
      message: "Server error, please try again later",
    });
  }
};
