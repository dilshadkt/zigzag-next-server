const { default: mongoose } = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    howToFindUs: {
      type: String,
      enum: [
        "Instagram",
        "LinkedIn",
        "Twitter",
        "YouTube",
        "Google Search",
        "Recommendation",
        "Other",
      ], // Updated options based on your dropdown
      required: true,
    },
    enquiryOn: {
      type: String,
    },
    budget: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Followed", "In Progress", "Closed", "Archived"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

exports.ContactUs = ContactUs;
