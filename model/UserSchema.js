// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    access: {
      type: [String],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true, // optional: adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", userSchema);
