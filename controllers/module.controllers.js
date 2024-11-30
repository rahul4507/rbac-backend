// controllers/module.controllers.js
const Module = require("../models/modules.models");

// Get all modules
exports.getAllModules = async (req, res, next) => {
  try {
    const modules = await Module.find(); // Fetch all modules from the database
    res.status(200).json({
      status: "success",
      data: {
        modules,
      },
    });
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }
};

// Create a new module
exports.createModule = async (req, res, next) => {
  try {
    const newModule = await Module.create(req.body); // Create a new module from request body
    res.status(201).json({
      status: "success",
      data: {
        module: newModule,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get active modules
exports.getActiveModules = async (req, res, next) => {
  try {
    const activeModules = await Module.find({ isActive: true }); // Fetch active modules only
    res.status(200).json({
      status: "success",
      data: {
        activeModules,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific module by ID
exports.getModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.moduleId); // Find module by ID
    if (!module) {
      return res.status(404).json({
        status: "fail",
        message: "Module not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        module,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update a module by ID
exports.updateModule = async (req, res, next) => {
  try {
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.moduleId,
      req.body,
      { new: true, runValidators: true } // Ensure the updated module is returned and validated
    );
    if (!updatedModule) {
      return res.status(404).json({
        status: "fail",
        message: "Module not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        module: updatedModule,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a module by ID
exports.deleteModule = async (req, res, next) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.moduleId); // Delete module by ID
    if (!module) {
      return res.status(404).json({
        status: "fail",
        message: "Module not found",
      });
    }
    res.status(204).json({
      status: "success",
      message: "Module successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
