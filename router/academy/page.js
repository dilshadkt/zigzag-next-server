const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
} = require("../../controller/academy/page");

const upload = multer({ dest: "uploads/" }); // Configure multer for file uploads

// Route to get all pages
router.get("/", getPages); // Get all pages with optional filters

// Route to get a single page by ID
router.get("/:id", getPage); // Get single page by ID

// Route to create a new page
router.post("/", upload.single("backgroundImage"), createPage); // Create new page with optional profile image upload

// Route to update a page by ID
router.put("/:id", upload.single("backgroundImage"), updatePage); // Update page with optional profile image upload

// Route to delete a page by ID
router.delete("/:id", deletePage); // Delete a page

module.exports = router;
