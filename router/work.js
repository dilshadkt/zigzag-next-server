const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
const asyncMiddleWare = require("../middleware/AsyncMiddleWare");
const {
  postWork,
  getAllWork,
  deleteWork,
  updateWorks,
  getLatestWorkd,
} = require("../controller/WorkController");
router.post("/", upload.array("photos", 6), asyncMiddleWare(postWork));
router.get("/", asyncMiddleWare(getAllWork));
router.delete("/:worksId", asyncMiddleWare(deleteWork));
router.patch("/:worksId", asyncMiddleWare(updateWorks));
router.get("/latest", asyncMiddleWare(getLatestWorkd));

module.exports = router;
