const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
const asyncMiddleWare = require("../middleware/AsyncMiddleWare");
const {
  postTestimonial,
  getTestimonial,
  deleteTestimonial,
  updateTestimonias,
} = require("../controller/TestimonialControll");

router.post("/", upload.single("photos"), asyncMiddleWare(postTestimonial));
router.get("/", asyncMiddleWare(getTestimonial));
router.delete("/:id", asyncMiddleWare(deleteTestimonial));
router.patch("/:id", asyncMiddleWare(updateTestimonias));

module.exports = router;
