const { uploader } = require("../../config/Cloudinary");
const FileRemover = require("../../config/FileRemover/FileRemove");
const { Placement } = require("../../model/academy/placement");

// Add new placement
const postPlacement = async (req, res) => {
  try {
    // Check if file exists
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    // Upload image to cloudinary
    let profileImage;
    try {
      profileImage = await uploader.upload(
        file.path,
        {
          public_id: `academic-placements/${file.originalname}`,
          folder: "academic-placements",
        },
        (error) => {
          if (error) {
            throw new Error("Image upload failed");
          } else {
            FileRemover(file); // Remove temporary file
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

    // Create new placement
    const placement = new Placement({
      name: req.body.name,
      role: req.body.role,
      profileImage: profileImage.secure_url,
    });

    // Save placement
    await placement.save();

    // Fetch all placements
    const placements = await Placement.find().sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: "Placement added successfully",
      data: placements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add placement",
      error: error.message,
    });
  }
};

// Get all placements
const getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: placements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch placements",
      error: error.message,
    });
  }
};

// Get single placement
const getPlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: placement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch placement",
      error: error.message,
    });
  }
};

// Update placement
const updatePlacement = async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
      role: req.body.role,
    };

    // Handle image update if new file is provided
    if (req.file) {
      const profileImage = await uploader.upload(
        req.file.path,
        {
          public_id: `academic-placements/${req.file.originalname}`,
          folder: "academic-placements",
        },
        (error) => {
          if (error) {
            throw new Error("Image upload failed");
          } else {
            FileRemover(req.file);
          }
        }
      );
      updateData.profileImage = profileImage.secure_url;

      // Delete old image from Cloudinary
      const oldPlacement = await Placement.findById(req.params.id);
      if (oldPlacement?.profileImage) {
        try {
          const publicId = oldPlacement.profileImage
            .split("/")
            .pop()
            .split(".")[0];
          await uploader.destroy(`academic-placements/${publicId}`);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
    }

    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    // Get updated list
    const placements = await Placement.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Placement updated successfully",
      data: placements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update placement",
      error: error.message,
    });
  }
};

// Delete placement
const deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    // Delete image from Cloudinary
    if (placement.profileImage) {
      try {
        const publicId = placement.profileImage.split("/").pop().split(".")[0];
        await uploader.destroy(`academic-placements/${publicId}`);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    // Delete placement from database
    await Placement.findByIdAndDelete(req.params.id);

    // Get updated list
    const placements = await Placement.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Placement deleted successfully",
      data: placements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete placement",
      error: error.message,
    });
  }
};

module.exports = {
  postPlacement,
  getPlacements,
  getPlacement,
  updatePlacement,
  deletePlacement,
};
