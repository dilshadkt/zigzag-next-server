const { default: mongoose } = require("mongoose");

const academicGallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AcademicGallery = mongoose.model(
  "AcademicGallery",
  academicGallerySchema
);

exports.AcademicGallery = AcademicGallery;
