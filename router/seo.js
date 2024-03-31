const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const asyncMiddleWare = require("../middleware/AsyncMiddleWare");
const {
  PostSeoContent,
  deleteImage,
  getSeoContent,
  getBlog,
  deleteContent,
  updateContent,
} = require("../controller/SeoController");

router.post(
  "/add-seo",
  upload.array("photos"),
  asyncMiddleWare(PostSeoContent)
);
router.delete("/delete/:imageId", asyncMiddleWare(deleteImage));
router.get("/", asyncMiddleWare(getSeoContent));
router.get("/:blogPath", asyncMiddleWare(getBlog));
router.delete("/", asyncMiddleWare(deleteContent));
router.patch("/", upload.single("photos"), asyncMiddleWare(updateContent));
module.exports = router;
