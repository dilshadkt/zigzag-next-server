const mongoose = require("mongoose");

const SeoSchema = new mongoose.Schema({
  test: {
    type: String,
  },
  photos: { type: String },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  metaKeyWord: {
    type: String,
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
