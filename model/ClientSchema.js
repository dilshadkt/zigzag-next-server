const mongoose = require("mongoose");

const Client = mongoose.model(
  "Clients",
  new mongoose.Schema({
    image: {
      type: String,
    },
    name: {
      type: String,
    },
  })
);

exports.Client = Client;
