const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
const asyncMiddleWare = require("../middleware/AsyncMiddleWare");
const {
  postBlog,
  deleletBlog,
  getLatestBlog,
  updatedBlog,
  getAllTestBlog,
} = require("../controller/BlogController");
router.post("/", upload.array("photos"), asyncMiddleWare(postBlog));
router.get("/", asyncMiddleWare(getAllTestBlog));
router.delete("/", asyncMiddleWare(deleletBlog));
router.patch("/", asyncMiddleWare(updatedBlog));
router.get("/latest", asyncMiddleWare(getLatestBlog));

module.exports = router;
