const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
const asyncMiddleWare = require("../middleware/AsyncMiddleWare");
const {
  postTestimonial,
  getTestimonial,
  deleteTestimonial,
  changeOrder,
  updateTestimonias,
} = require("../controller/TestimonialControll");

router.post("/", upload.single("photos"), asyncMiddleWare(postTestimonial));
router.get("/", asyncMiddleWare(getTestimonial));
router.post("/order", asyncMiddleWare(changeOrder));
router.delete("/:id", asyncMiddleWare(deleteTestimonial));
router.patch(
  "/:id",
  upload.single("photos"),
  asyncMiddleWare(updateTestimonias)
);

module.exports = router;
