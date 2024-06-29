const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
const asyncMiddleWare = require("../middleware/AsyncMiddleWare");
const {
  postClient,
  getClients,
  deleteClient,
  updateClients,
  changeOrder,
} = require("../controller/ClientController");
router.post("/", upload.single("photos"), asyncMiddleWare(postClient));
router.post("/order", asyncMiddleWare(changeOrder));
router.get("/", asyncMiddleWare(getClients));
router.delete("/:clientId", asyncMiddleWare(deleteClient));
router.patch("/:clientId", asyncMiddleWare(updateClients));
module.exports = router;
