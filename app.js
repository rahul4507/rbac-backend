const express = require("express");
const userRouter = require("./routes/user.routes");
const roleRouter = require("./routes/role.routes");
const moduleRouter = require("./routes/modules.routes");
const authRoutes = require("./routes/auth.routes");
const AppError = require("./utils/appError.utils");
const errorHandler = require("./middlewares/error.middleware");
const protect = require("./middlewares/auth.middleware"); // Import the protect middleware

const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.json());

// Use CORS middleware to enable CORS
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Routes
// Public routes (register, login)
app.use("/api/v1/auth", authRoutes);

// Protect all other routes
app.use("/api/v1/users", protect, userRouter);
app.use("/api/v1/roles", protect, roleRouter);
app.use("/api/v1/modules", protect, moduleRouter);

// 404 route handling middleware
app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error handling middleware
// This middleware gets called when next is called with an argument error
app.use(errorHandler);

module.exports = app;
