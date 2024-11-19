const { default: mongoose } = require("mongoose");

const academicTestimonialSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AcademicTestimonial = mongoose.model(
  "AcademicTestimonial",
  academicTestimonialSchema
);

exports.AcademicTestimonial = AcademicTestimonial;
