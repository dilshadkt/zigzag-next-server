const mongoose = require("mongoose");

const testimonialScheam = new mongoose.Schema({
  photos: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
  },
  color: {
    type: String,
  },
  role: {
    type: String,
  },
});

const Testimonial = mongoose.model("Testimonial", testimonialScheam);
exports.Testimonial = Testimonial;
