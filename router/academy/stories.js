const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  postStory,
  getStories,
  getStory,
  updateStory,
  deleteStory,
} = require("../../controller/academy/stories");
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/", upload.single("profileImage"), postStory);
router.get("/", getStories);
router.get("/:id", getStory);
router.put("/:id", upload.single("profileImage"), updateStory);
router.delete("/:id", deleteStory);

module.exports = router;
