// routes/modules.routes.js
const express = require("express");
const moduleController = require("../controllers/module.controllers");

const router = express.Router();

// Define routes for modules
router
  .route("/")
  .get(moduleController.getAllModules) // Get all modules
  .post(moduleController.createModule); // Create a new module

router.route("/active").get(moduleController.getActiveModules); // Get active modules

router
  .route("/:moduleId")
  .get(moduleController.getModule) // Get a specific module by ID
  .patch(moduleController.updateModule) // Update a module by ID
  .delete(moduleController.deleteModule); // Delete a module by ID

module.exports = router;
