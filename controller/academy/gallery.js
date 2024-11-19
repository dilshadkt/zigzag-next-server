const { uploader } = require("../../config/Cloudinary");
const FileRemover = require("../../config/FileRemover/FileRemove");
const { AcademicGallery } = require("../../model/academy/gallery");

// Add new gallery item
const postGalleryItem = async (req, res) => {
  try {
    // Check if file exists
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Upload image to cloudinary
    let image;
    try {
      image = await uploader.upload(
        file.path,
        {
          public_id: `academic-gallery/${file.originalname}`,
          folder: "academic-gallery",
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
        message: "Failed to upload image. Please try again later",
        error: error.message,
      });
    }

    // Create new gallery item
    const galleryItem = new AcademicGallery({
      title: req.body.title,
      image: image.secure_url,
    });

    // Save gallery item
    await galleryItem.save();

    // Fetch all gallery items
    const galleryItems = await AcademicGallery.find().sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: "Gallery item added successfully",
      data: galleryItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add gallery item",
      error: error.message,
    });
  }
};

// Get all gallery items
const getGalleryItems = async (req, res) => {
  try {
    const galleryItems = await AcademicGallery.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: galleryItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery items",
      error: error.message,
    });
  }
};

// Get single gallery item
const getGalleryItem = async (req, res) => {
  try {
    const galleryItem = await AcademicGallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery item",
      error: error.message,
    });
  }
};

// Update gallery item
const updateGalleryItem = async (req, res) => {
  try {
    let updateData = {
      title: req.body.title,
    };

    // Handle image update if new file is provided
    if (req.file) {
      const image = await uploader.upload(
        req.file.path,
        {
          public_id: `academic-gallery/${req.file.originalname}`,
          folder: "academic-gallery",
        },
        (error) => {
          if (error) {
            throw new Error("Image upload failed");
          } else {
            FileRemover(req.file);
          }
        }
      );
      updateData.image = image.secure_url;

      // Delete old image from Cloudinary
      const oldItem = await AcademicGallery.findById(req.params.id);
      if (oldItem?.image) {
        try {
          const publicId = oldItem.image.split("/").pop().split(".")[0];
          await uploader.destroy(`academic-gallery/${publicId}`);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
    }

    const galleryItem = await AcademicGallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // Get updated list
    const galleryItems = await AcademicGallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: galleryItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update gallery item",
      error: error.message,
    });
  }
};

// Delete gallery item
const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await AcademicGallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // Delete image from Cloudinary
    if (galleryItem.image) {
      try {
        const publicId = galleryItem.image.split("/").pop().split(".")[0];
        await uploader.destroy(`academic-gallery/${publicId}`);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    // Delete gallery item from database
    await AcademicGallery.findByIdAndDelete(req.params.id);

    // Get updated list
    const galleryItems = await AcademicGallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
      data: galleryItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete gallery item",
      error: error.message,
    });
  }
};

module.exports = {
  postGalleryItem,
  getGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
