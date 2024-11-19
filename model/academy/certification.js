const { default: mongoose } = require("mongoose");

const academicCertificationSchema = new mongoose.Schema(
  {
    certificationImage: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AcademicCertification = mongoose.model(
  "AcademicCertification",
  academicCertificationSchema
);

exports.AcademicCertification = AcademicCertification;
