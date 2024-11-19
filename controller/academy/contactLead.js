const { ContactLead } = require("../../model/academy/contactLead");

// Create new contact lead
const createContactLead = async (req, res) => {
  try {
    const contactLead = new ContactLead({
      fullName: req.body.fullName,
      email: req.body.email,
      number: req.body.number,
      message: req.body.message,
    });

    await contactLead.save();

    const contactLeads = await ContactLead.find().sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: "Contact lead created successfully",
      data: contactLeads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create contact lead",
      error: error.message,
    });
  }
};

// Get all contact leads
const getContactLeads = async (req, res) => {
  try {
    const contactLeads = await ContactLead.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: contactLeads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact leads",
      error: error.message,
    });
  }
};

// Get single contact lead
const getContactLead = async (req, res) => {
  try {
    const contactLead = await ContactLead.findById(req.params.id);

    if (!contactLead) {
      return res.status(404).json({
        success: false,
        message: "Contact lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contactLead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact lead",
      error: error.message,
    });
  }
};

// Update contact lead status
const updateContactLeadStatus = async (req, res) => {
  try {
    if (
      !["Pending", "Followed", "In Progress", "Closed", "Archived"].includes(
        req.body.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const contactLead = await ContactLead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!contactLead) {
      return res.status(404).json({
        success: false,
        message: "Contact lead not found",
      });
    }

    const contactLeads = await ContactLead.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Contact lead status updated successfully",
      data: contactLeads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update contact lead status",
      error: error.message,
    });
  }
};

// Delete contact lead
const deleteContactLead = async (req, res) => {
  try {
    const contactLead = await ContactLead.findByIdAndDelete(req.params.id);

    if (!contactLead) {
      return res.status(404).json({
        success: false,
        message: "Contact lead not found",
      });
    }

    const contactLeads = await ContactLead.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Contact lead deleted successfully",
      data: contactLeads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete contact lead",
      error: error.message,
    });
  }
};

// Get contact leads by status
const getContactLeadsByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    if (
      !status ||
      !["Pending", "Followed", "In Progress", "Closed", "Archived"].includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status parameter",
      });
    }

    const contactLeads = await ContactLead.find({ status }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: contactLeads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact leads",
      error: error.message,
    });
  }
};

module.exports = {
  createContactLead,
  getContactLeads,
  getContactLead,
  updateContactLeadStatus,
  deleteContactLead,
  getContactLeadsByStatus,
};
