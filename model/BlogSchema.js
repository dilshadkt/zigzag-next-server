const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  photos: { type: String },
  test: {
    type: String,
  },
  // mainHead: {
  //   type: String,
  // },
  // description: {
  //   type: String,
  // },
  // conclustion: {
  //   type: String,
  // },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
});

const Blog = mongoose.model("Blogs", blogSchema);
exports.Blog = Blog;
