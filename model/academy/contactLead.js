const { default: mongoose } = require("mongoose");

const contactLeadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      default: () => {
        const today = new Date();
        return today.toLocaleDateString("en-GB"); // Format: DD-MM-YYYY
      },
    },
    platform: {
      type: String,
    },
    place: {
      type: String,
    },
    qualification: {
      type: String,
    },
    leadQaulity: {
      type: String,
    },
    prefered: {
      type: String,
      enum: ["Online", "Offline", "Weekend"],
    },
    chosenTime: {
      type: String,
      // enum: ["Moring", "Afternoon", "Night"],
    },
    FolowpDate: {
      type: Date,
    },
    updatedAtttender: {
      type: String,
    },
    joining: {
      type: String,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    number: {
      type: String,
      trim: true,
    },
    whatsAppNumber: {
      type: String,
    },
    response: [
      {
        message: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    message: {
      type: String,
    },
    remarks: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Connected", "Not Connected", "Pending", "Closed", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const ContactLead = mongoose.model("ContactLead", contactLeadSchema);

exports.ContactLead = ContactLead;
