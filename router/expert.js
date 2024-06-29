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
  changeOrder,
} = require("../controller/ExpertController");

router.post("/", upload.single("photos"), asyncMiddleWare(addExperts));
router.post("/order", asyncMiddleWare(changeOrder));
router.get("/", asyncMiddleWare(getAllExperts));
router.delete("/:expertId", asyncMiddleWare(deleteExpert));
router.patch(
  "/:expertId",
  upload.single("photos"),
  asyncMiddleWare(updateExperts)
);
module.exports = router;
