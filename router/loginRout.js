const router = require("express").Router();
const asyncMiddleWare = require("../middleware/AsyncMiddleWare");
const { verifyLogin } = require("../controller/LoginController");
router.post("/", asyncMiddleWare(verifyLogin));
module.exports = router;
