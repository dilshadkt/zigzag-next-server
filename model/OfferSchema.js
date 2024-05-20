const { default: mongoose } = require("mongoose");

const offerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
  },
});

const Offer = mongoose.model("Offer", offerSchema);

exports.Offer = Offer;
