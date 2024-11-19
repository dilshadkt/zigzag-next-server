const { default: mongoose } = require("mongoose");

const academicStoriesSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    designation: {
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

const AcademicStories = mongoose.model(
  "AcademicStories",
  academicStoriesSchema
);

exports.AcademicStories = AcademicStories;
