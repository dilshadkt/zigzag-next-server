const { Lead } = require("../model/LeadSchema");

const addLeaed = async (req, res) => {
  const lead = req.body;
  const newLead = new Lead(lead);
  const newlyAddedLead = await newLead.save();
  res.status(200).json({ isSuccess: true, lead: newlyAddedLead });
};
const getAllLeads = async (req, res) => {
  const leads = await Lead.find();
  if (!leads) {
    return res.status(400).send({ message: "Leads not found" });
  }
  res.status(200).json({ isSuccess: true, leads });
};

module.exports = { addLeaed, getAllLeads };
