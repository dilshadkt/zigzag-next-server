const mongoose = require("mongoose");

const WorkSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  type: {
    type: String,
  },

  stared: {
    type: String,
  },
});

const Work = mongoose.model("Work", WorkSchema);
exports.Work = Work;
