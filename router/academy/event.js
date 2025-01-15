const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  postEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../../controller/academy/event");

const upload = multer({ dest: "uploads/" });

// Routes
router.post("/", upload.single("profileImage"), postEvent);
router.get("/", getEvents);
router.get("/:id", getEvent);
router.put("/:id", upload.single("profileImage"), updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
