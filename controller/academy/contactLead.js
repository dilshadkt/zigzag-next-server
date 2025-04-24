const { ContactLead } = require("../../model/academy/contactLead");

// Create new contact lead
const createContactLead = async (req, res) => {
  try {
    // Create contact lead with required fields
    const contactLead = new ContactLead({
      email: req.body.email,
      number: req.body.number,
      message: req.body.message,
    });

    // Add optional fields if they exist in the request
    if (req.body.fullName) contactLead.fullName = req.body.fullName;
    if (req.body.name) contactLead.fullName = req.body.name;
    if (req.body.status) contactLead.status = req.body.status;
    if (req.body.platform) contactLead.platform = req.body.platform;
    if (req.body.joining) contactLead.joining = req.body.joining;
    if (req.body.date) contactLead.date = req.body.date;
    if (req.body.place) contactLead.place = req.body.place;
    if (req.body.remarks) contactLead.remarks = req.body.remarks;
    if (req.body.response) contactLead.response = req.body.response;
    if (req.body.chosenTime) contactLead.chosenTime = req.body.chosenTime;
    if (req.body.FolowpDate) contactLead.FolowpDate = req.body.FolowpDate;
    if (req.body.updatedAtttender)
      contactLead.updatedAtttender = req.body.updatedAtttender;
    if (req.body.prefered) contactLead.prefered = req.body.prefered;
    if (req.body.leadQaulity) contactLead.leadQaulity = req.body.leadQaulity;
    if (req.body.qualification)
      contactLead.qualification = req.body.qualification;
    if (req.body.whatsAppNumber)
      contactLead.whatsAppNumber = req.body.whatsAppNumber;

    // Save the contact lead
    await contactLead.save();

    // Return all contact leads sorted by creation date
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
      !["Connected", "Not Connected", "Pending", "Closed", "Rejected"].includes(
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
      !["Connected", "Not Connected", "Pending", "Closed", "Rejected"].includes(
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
const bulkUploads = async (req, res) => {
  try {
    const leads = req.body;

    // Validate each lead
    const validLeads = [];
    const errors = [];

    for (const lead of leads) {
      try {
        const newLead = new ContactLead(lead);
        await newLead.validate();
        validLeads.push(newLead);
      } catch (error) {
        errors.push({
          lead,
          error: error.message,
        });
      }
    }

    if (validLeads.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "No valid leads found",
        errors,
      });
    }

    const result = await ContactLead.insertMany(validLeads, { ordered: false });

    res.status(200).json({
      isSuccess: true,
      insertedCount: result.length,
      errors,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Error processing bulk upload",
    });
  }
};

const updateContactLead = async (req, res) => {
  try {
    const contactLead = await ContactLead.findByIdAndUpdate(
      req.params.leadId,
      req.body,
      { new: true }
    );

    if (!contactLead) {
      return res.status(404).json({
        success: false,
        message: "Contact lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact lead status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update contact lead status",
      error: error.message,
    });
  }
};

const bulkDelete = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid IDs provided" });
  }
  try {
    await ContactLead.deleteMany({ _id: { $in: ids } });
    const updatedData = await ContactLead.find();
    res.status(200).json({
      success: true,
      message: "Items deleted successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Failed to delete items:", error);
    res.status(500).json({ success: false, message: "Failed to delete items" });
  }
};

module.exports = {
  bulkUploads,
  createContactLead,
  getContactLeads,
  getContactLead,
  updateContactLeadStatus,
  deleteContactLead,
  getContactLeadsByStatus,
  updateContactLead,
  bulkDelete,
};
