const { ContactUs } = require("../model/ContactSchema");

const addContactLead = async (req, res) => {
  const lead = req.body;
  const newLead = new ContactUs(lead);
  const newlyAddedLead = await newLead.save();
  res.status(200).json({ isSuccess: true, lead: newlyAddedLead });
};
const getContactLead = async (req, res) => {
  const leads = await ContactUs.find();
  if (!leads) {
    return res.status(400).send({ message: "Leads not found" });
  }
  res.status(200).json({ isSuccess: true, leads });
};
const deleteContactLead = async (req, res) => {
  const { leadId } = req.params;

  try {
    // Check if the lead exists before attempting deletion
    const leadToDelete = await ContactUs.findById(leadId);
    if (!leadToDelete) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Lead not found" });
    }

    // Delete the lead
    await ContactUs.findByIdAndDelete(leadId);

    // Fetch the updated list of leads
    const updatedLeads = await ContactUs.find();

    // Send the updated array as the response
    res.status(200).json({
      isSuccess: true,
      message: "Lead deleted successfully",
      leads: updatedLeads,
    });
  } catch (error) {
    // Handle errors (e.g., invalid `leadId` or database issues)
    res.status(500).json({
      isSuccess: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

const updateContactLeadStatus = async (req, res) => {
  const { leadId } = req.params; // Lead ID from the request URL
  const { status } = req.body; // New status from the request body

  try {
    // Validate the new status
    const validStatuses = [
      "Pending",
      "Followed",
      "In Progress",
      "Closed",
      "Archived",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Invalid status value" });
    }

    // Check if the lead exists
    const leadToUpdate = await ContactUs.findById(leadId);
    if (!leadToUpdate) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Lead not found" });
    }

    // Update the lead's status
    leadToUpdate.status = status;
    await leadToUpdate.save();

    // Fetch the updated list of leads
    const updatedLeads = await ContactUs.find();

    // Respond with the updated list of leads
    res.status(200).json({
      isSuccess: true,
      message: "Lead status updated successfully",
      updatedLead: leadToUpdate,
      leads: updatedLeads,
    });
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({
        isSuccess: false,
        message: "An error occurred",
        error: error.message,
      });
  }
};

module.exports = {
  addContactLead,
  getContactLead,
  deleteContactLead,
  updateContactLeadStatus,
};
