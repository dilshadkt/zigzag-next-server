const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  postCertificate,
  getCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate,
} = require("../../controller/academy/certificate");

// Routes
router.post("/", upload.single("certificationImage"), postCertificate);
router.get("/", getCertificates);
router.get("/:id", getCertificate);
router.put("/:id", upload.single("certificationImage"), updateCertificate);
router.delete("/:id", deleteCertificate);

module.exports = router;
