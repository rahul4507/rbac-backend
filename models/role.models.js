const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide role name"],
    },
    role: {
      type: String,
      required: [true, "Please provide role"],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
