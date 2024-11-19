const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  postPlacement,
  getPlacements,
  getPlacement,
  updatePlacement,
  deletePlacement,
} = require("../../controller/academy/placement");
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/", upload.single("photos"), postPlacement);
router.get("/", getPlacements);
router.get("/:id", getPlacement);
router.put("/:id", upload.single("photos"), updatePlacement);
router.delete("/:id", deletePlacement);

module.exports = router;
