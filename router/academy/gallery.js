const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  postGalleryItem,
  getGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../../controller/academy/gallery");
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/", upload.single("photos"), postGalleryItem);
router.get("/", getGalleryItems);
router.get("/:id", getGalleryItem);
router.put("/:id", upload.single("photos"), updateGalleryItem);
router.delete("/:id", deleteGalleryItem);

module.exports = router;
