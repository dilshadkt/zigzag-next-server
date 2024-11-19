const { default: mongoose } = require("mongoose");

const contactLeadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    number: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
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

const ContactLead = mongoose.model("ContactLead", contactLeadSchema);

exports.ContactLead = ContactLead;
