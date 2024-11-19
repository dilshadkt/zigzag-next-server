const { uploader } = require("../../config/Cloudinary");
const FileRemover = require("../../config/FileRemover/FileRemove");
const { AcademicTestimonial } = require("../../model/academy/testimonial");
const _ = require("lodash");

const postTestimonial = async (req, res) => {
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
          public_id: `academic-testimonials/${file.originalname}`,
          folder: "academic-testimonials",
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

    // Create new testimonial
    const testimonial = new AcademicTestimonial({
      userName: req.body.userName,
      content: req.body.content,
      profileImage: profileImage.secure_url, // Using secure_url for HTTPS
    });

    // Save testimonial
    await testimonial.save();

    // Fetch all testimonials
    const testimonials = await AcademicTestimonial.find().sort({
      createdAt: -1,
    });

    res.status(201).json({
      success: true,
      message: "Testimonial added successfully",
      data: testimonials,
    });
  } catch (error) {
    // Error handling
    return res.status(500).json({
      success: false,
      message: "Failed to add testimonial",
      error: error.message,
    });
  }
};

// Get all testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await AcademicTestimonial.find().sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
};
const getTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await AcademicTestimonial.findById(id);
    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
};

// Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await AcademicTestimonial.findByIdAndDelete(
      req.params.id
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Get updated list
    const testimonials = await AcademicTestimonial.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
      error: error.message,
    });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    let updateData = {
      userName: req.body.userName,
      content: req.body.content,
    };

    // Handle image update if new file is provided
    if (req.file) {
      const profileImage = await uploader.upload(
        req.file.path,
        {
          public_id: `academic-testimonials/${req.file.originalname}`,
          folder: "academic-testimonials",
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
    }

    const testimonial = await AcademicTestimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Get updated list
    const testimonials = await AcademicTestimonial.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update testimonial",
      error: error.message,
    });
  }
};

module.exports = {
  postTestimonial,
  getTestimonials,
  deleteTestimonial,
  updateTestimonial,
  getTestimonial,
};
