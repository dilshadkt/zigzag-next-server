const router = require("express").Router();
const { getAllCategory } = require("../controller/CategoryController");
const asyncMiddleWare = require("../middleware/AsyncMiddleWare");

router.get("/", asyncMiddleWare(getAllCategory));
module.exports = router;
