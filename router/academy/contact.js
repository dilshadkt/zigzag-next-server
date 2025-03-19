const express = require("express");
const {
  createContactLead,
  getContactLeads,
  getContactLeadsByStatus,
  getContactLead,
  updateContactLeadStatus,
  deleteContactLead,
  bulkUploads,
  updateContactLead,
} = require("../../controller/academy/contactLead");
const router = express.Router();

// Routes
router.post("/", createContactLead);
router.post("/upload-leads", bulkUploads);
router.get("/", getContactLeads);
router.get("/status", getContactLeadsByStatus);
router.get("/:id", getContactLead);
router.put("/:leadId", updateContactLead);
router.put("/:id/status", updateContactLeadStatus);
router.delete("/:id", deleteContactLead);

module.exports = router;
