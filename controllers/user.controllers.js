const User = require("./../models/user.models");
const APIFeatures = require("./../utils/apiFeatures.utils");
const AppError = require("./../utils/appError.utils");
const catchAsync = require("./../utils/catchAsync.utils");

// Get all users
exports.getAllUser = catchAsync(async (req, res, next) => {
  // Build the query
  const apiFeatures = new APIFeatures(
    User.find().populate({
      path: "role", // Populate the role field
      select: "name modules", // Only include the name and modules
      populate: {
        path: "modules", // Populate the modules inside the role
        select: "name", // Only include the module names
      },
    }),
    req.query
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  // Execute the query
  const users = await apiFeatures.query;

  // Transform the response to include role name and module names
  const usersWithDetails = users.map((user) => ({
    ...user.toObject(),
  }));

  // Send the response
  res.status(200).json({
    status: "success",
    results: usersWithDetails.length,
    data: {
      users: usersWithDetails,
    },
  });
});

// Reading a single user by userId
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId).populate("role");

  if (!user) {
    return next(new AppError("No user found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Creating user
exports.createUser = catchAsync(async (req, res, next) => {
  const { type, masterEmail } = req.body;

  // If the user type is "User", validate the masterEmail
  if (type === "User" && !masterEmail) {
    return next(new AppError("Master email is required for users", 400));
  }

  // If masterEmail is provided, validate that it exists as an admin or supervisor
  if (masterEmail) {
    const master = await User.findOne({ email: masterEmail, type: "Admin" });
    if (!master) {
      return next(
        new AppError(
          "Master email must belong to a valid admin or supervisor.",
          400
        )
      );
    }
  }

  // Create the user
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// Updating user
exports.updateUser = catchAsync(async (req, res, next) => {
  const { type, masterEmail } = req.body;

  // If the user type is "User", validate the masterEmail
  if (type === "User" && !masterEmail) {
    return next(new AppError("Master email is required for users", 400));
  }

  // If masterEmail is provided, validate that it exists as an admin or supervisor
  if (masterEmail) {
    const master = await User.findOne({ email: masterEmail, type: "Admin" });
    if (!master) {
      return next(
        new AppError(
          "Master email must belong to a valid admin or supervisor.",
          400
        )
      );
    }
  }

  // Update the user
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No user found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Deleting user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.userId);

  if (!user) {
    return next(new AppError("No user found", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});
