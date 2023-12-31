const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
const asyncMiddleWare = require("../middleware/AsyncMiddleWare");
const {
  addExperts,
  getAllExperts,
  deleteExpert,
  updateExperts,
} = require("../controller/ExpertController");

router.post("/", upload.single("photos"), asyncMiddleWare(addExperts));
router.get("/", asyncMiddleWare(getAllExperts));
router.delete("/:expertId", asyncMiddleWare(deleteExpert));
router.patch("/expertId", asyncMiddleWare(updateExperts));
module.exports = router;
