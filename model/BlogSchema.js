const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  photos: { type: String },
  test: {
    type: Array,
  },
  mainHead: {
    type: String,
  },
  description: {
    type: String,
  },
  conclustion: {
    type: String,
  },
  metaTitle: {
    Type: String,
  },
  metaDescription: {
    Type: String,
  },
});

const Blog = mongoose.model("Blogs", blogSchema);
exports.Blog = Blog;
