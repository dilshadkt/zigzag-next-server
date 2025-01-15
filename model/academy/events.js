const { default: mongoose } = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AcademicEvents = mongoose.model("AcademicEvents", eventSchema);

exports.AcademicEvents = AcademicEvents;
