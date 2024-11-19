const {
  addContactLead,
  deleteContactLead,
  getContactLead,
  updateContactLeadStatus,
} = require("../controller/ContactController");
const AsyncMiddleWare = require("../middleware/AsyncMiddleWare");

const router = require("express").Router();

router.post("/add-lead", AsyncMiddleWare(addContactLead));
router.get("/get-leads", AsyncMiddleWare(getContactLead));
router.delete("/delete-lead/:leadId", AsyncMiddleWare(deleteContactLead));
router.put("/update-lead/:leadId", AsyncMiddleWare(updateContactLeadStatus));

module.exports = router;
