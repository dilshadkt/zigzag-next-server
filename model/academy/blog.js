const { default: mongoose } = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    blogBannerImage: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // SEO and Meta Data
    metaTitle: {
      type: String,
      required: true,
      trim: true,
    },
    metaDescription: {
      type: String,
      required: true,
      trim: true,
    },
    metaKeywords: {
      type: [String],
      default: [],
    },
    // Open Graph Meta Data
    ogTitle: {
      type: String,
      trim: true,
    },
    ogDescription: {
      type: String,
      trim: true,
    },
    // Blog Status
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    // Timestamps are automatically managed by the schema
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save hook to generate path from title if not provided
blogSchema.pre("save", function (next) {
  if (!this.path) {
    this.path = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Create indexes for better query performance
blogSchema.index({ path: 1 }, { unique: true });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ status: 1, createdAt: -1 });

const AcademicBlog = mongoose.model("AcademicBlog", blogSchema);

exports.AcademicBlog = AcademicBlog;
