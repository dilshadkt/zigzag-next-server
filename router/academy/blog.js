const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByStatus,
} = require("../../controller/academy/blog");
const upload = multer({ dest: "uploads/" });

router.get("/", getBlogs); // Get all blogs with optional filters
router.get("/:id", getBlog); // Get single blog by ID or path
router.get("/status/:status", getBlogsByStatus); // Get single blog by ID or path
router.post("/", upload.single("blogBannerImage"), createBlog); // Create new blog
router.put("/:id", upload.single("blogBannerImage"), updateBlog); // Update blog
router.delete("/:id", deleteBlog);

module.exports = router;
