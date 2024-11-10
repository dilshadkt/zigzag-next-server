const { default: mongoose } = require("mongoose");

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  deadline: {
    type: String,
  },
  skills: {
    type: String,
    required: true,
  },
});

const Career = mongoose.model("Career", careerSchema);

exports.Career = Career;
