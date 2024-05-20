const AsyncMiddleWare = require("../middleware/AsyncMiddleWare");
const {
  createOffer,
  getAllOffer,
  updateOffer,
  deleteOffer,
} = require("../controller/OfferController");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), AsyncMiddleWare(createOffer));
router.get("/", AsyncMiddleWare(getAllOffer));
router.patch("/:offerId", AsyncMiddleWare(updateOffer));
router.delete("/:offerId", AsyncMiddleWare(deleteOffer));

module.exports = router;
