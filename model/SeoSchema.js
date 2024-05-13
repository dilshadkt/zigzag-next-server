const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  heading: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

const SeoSchema = new mongoose.Schema({
  page: [pageSchema],
  photos: { type: String },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  metaKeyWord: {
    type: [String],
  },
  ogTitle: {
    type: String,
  },
  ogDescription: {
    type: String,
  },
  path: {
    type: String,
  },
});

const Seo = mongoose.model("Seo", SeoSchema);

exports.Seo = Seo;
