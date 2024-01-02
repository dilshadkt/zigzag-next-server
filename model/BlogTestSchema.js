const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  photos: { type: String },
  test: {
    type: String,
  },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
});

const Blog = mongoose.model("BlogsTest", blogSchema);
exports.Blog = Blog;
