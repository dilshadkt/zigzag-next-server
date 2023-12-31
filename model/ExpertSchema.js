const mongoose = require("mongoose");

const Expert = mongoose.model(
  "Experts",
  new mongoose.Schema({
    image: {
      type: String,
    },
    name: {
      type: String,
    },
    role: {
      type: String,
    },
  })
);

exports.Expert = Expert;
