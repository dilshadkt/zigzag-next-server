const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();

const AsyncMiddleWare = require("../../middleware/AsyncMiddleWare");
const {
  postTestimonial,
  getTestimonials,
  deleteTestimonial,
  updateTestimonial,
  getTestimonial,
} = require("../../controller/academy/testmonial");

router.post("/", upload.single("photos"), AsyncMiddleWare(postTestimonial));
router.get("/", AsyncMiddleWare(getTestimonials));
router.get("/:id", AsyncMiddleWare(getTestimonial));
// router.post("/order", AsyncMiddleWare(deleteTestimonial));
router.delete("/:id", AsyncMiddleWare(deleteTestimonial));
router.patch(
  "/:id",
  upload.single("photos"),
  AsyncMiddleWare(updateTestimonial)
);

module.exports = router;
