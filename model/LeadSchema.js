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
  },
  number: {
    type: String,
  },
});

const Lead = mongoose.model("Lead", leadSchema);

exports.Lead = Lead;
