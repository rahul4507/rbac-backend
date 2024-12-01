const express = require("express");
const authController = require("../controllers/auth.controllers");
const adminController = require("../controllers/admin.controllers");

const router = express.Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/register-admin", adminController.registerAdmin);

module.exports = router;
