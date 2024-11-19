const { default: mongoose } = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Placement = mongoose.model("Placement", placementSchema);

exports.Placement = Placement;
