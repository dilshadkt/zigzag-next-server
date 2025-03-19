const { default: mongoose } = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  service: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  number: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
  },
});

const Lead = mongoose.model("Lead", leadSchema);

exports.Lead = Lead;
