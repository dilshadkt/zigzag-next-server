const { uploader } = require("../../config/Cloudinary");
const FileRemover = require("../../config/FileRemover/FileRemove");
const { AcademicBlog } = require("../../model/academy/blog");
const { Page } = require("../../model/academy/pages");

// Get all pages
exports.getPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single page by ID
exports.getPage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new page
exports.createPage = async (req, res) => {
  try {
    const {
      landPage,
      oppertunity,
      batches,
      placement,
      clients,
      stories,
      whyUs,
      ourExpert,
      life,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogTitle,
      ogDescription,
      path,
      modules,
    } = req.body;

    const backgroundImage = req.file ? req.file.path : null;
    const file = req.file;
    if (!backgroundImage) {
      return res.status(400).json({ error: "Background image is required" });
    }

    let pageBackgroundImage;
    try {
      pageBackgroundImage = await uploader.upload(
        file.path,
        {
          public_id: `blog-banners/${file.originalname}`,
          folder: "blog-banners",
        },
        (error) => {
          if (error) {
            throw new Error("Image upload failed");
          } else {
            FileRemover(file);
          }
        }
      );
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Failed to upload banner image",
        error: error.message,
      });
    }

    // Parse JSON strings into objects
    const newPage = new Page({
      backgroundImage: pageBackgroundImage.secure_url,
      landPage: JSON.parse(landPage),
      oppertunity: JSON.parse(oppertunity),
      batches: JSON.parse(batches),
      placement: JSON.parse(placement),
      clients: JSON.parse(clients),
      stories: JSON.parse(stories),
      whyUs: JSON.parse(whyUs),
      ourExpert: JSON.parse(ourExpert),
      life: JSON.parse(life),
      metaTitle: JSON.parse(metaTitle),
      metaDescription: JSON.parse(metaDescription),
      metaKeywords: JSON.parse(metaKeywords || '""'),
      ogTitle: JSON.parse(ogTitle || '""'),
      ogDescription: JSON.parse(ogDescription || '""'),
      path: JSON.parse(path),
      modules: JSON.parse(modules),
    });

    await newPage.save();

    res.status(201).json({
      success: true,
      message: "Page created successfully",
      data: newPage,
    });
  } catch (error) {
    console.error("Error creating page:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create page",
      error: error.message,
    });
  }
};
// Update a page by ID
exports.updatePage = async (req, res) => {
  try {
    const {
      landPage,
      oppertunity,
      batches,
      placement,
      clients,
      stories,
      whyUs,
      ourExpert,
      life,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogTitle,
      ogDescription,
      path,
      modules,
    } = req.body;

    // Handle image upload if a new file is provided
    let pageBackgroundImage;
    if (req.file) {
      const file = req.file;
      try {
        pageBackgroundImage = await uploader.upload(
          file.path,
          {
            public_id: `blog-banners/${file.originalname}`,
            folder: "blog-banners",
          },
          (error) => {
            if (error) {
              throw new Error("Image upload failed");
            } else {
              FileRemover(file);
            }
          }
        );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload banner image",
          error: error.message,
        });
      }
    }

    // Create update object with parsed JSON values
    const updateData = {
      ...(pageBackgroundImage && {
        backgroundImage: pageBackgroundImage.secure_url,
      }),
      landPage: JSON.parse(landPage),
      oppertunity: JSON.parse(oppertunity),
      batches: JSON.parse(batches),
      placement: JSON.parse(placement),
      clients: JSON.parse(clients),
      stories: JSON.parse(stories),
      whyUs: JSON.parse(whyUs),
      ourExpert: JSON.parse(ourExpert),
      life: JSON.parse(life),
      metaTitle: JSON.parse(metaTitle),
      metaDescription: JSON.parse(metaDescription),
      metaKeywords: JSON.parse(metaKeywords || '""'),
      ogTitle: JSON.parse(ogTitle || '""'),
      ogDescription: JSON.parse(ogDescription || '""'),
      path: JSON.parse(path),
      modules: JSON.parse(modules),
    };

    const updatedPage = await Page.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedPage) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Page updated successfully",
      data: updatedPage,
    });
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update page",
      error: error.message,
    });
  }
};

// Delete a page by ID
exports.deletePage = async (req, res) => {
  try {
    const deletedPage = await Page.findByIdAndDelete(req.params.id);
    if (!deletedPage) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
