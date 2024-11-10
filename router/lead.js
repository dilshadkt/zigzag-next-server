const { addLeaed, getAllLeads } = require("../controller/LeadController");
const AsyncMiddleWare = require("../middleware/AsyncMiddleWare");

const router = require("express").Router();

router.post("/add-lead", AsyncMiddleWare(addLeaed));
router.get("/get-leads", AsyncMiddleWare(getAllLeads));

module.exports = router;
