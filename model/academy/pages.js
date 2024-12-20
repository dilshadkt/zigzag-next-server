const { default: mongoose } = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    backgroundImage: {
      type: String,
      required: true,
    },
    landPage: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    oppertunity: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    batches: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    placement: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    clients: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    stories: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    whyUs: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    ourExpert: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    life: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    // SEO fields
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    path: { type: String, required: true },
    modules: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Page = mongoose.model("Page", pageSchema);

exports.Page = Page;
