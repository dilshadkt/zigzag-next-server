const { uploader } = require("../../config/Cloudinary");
const FileRemover = require("../../config/FileRemover/FileRemove");
const { AcademicCertification } = require("../../model/academy/certification");

// Add new certificate
const postCertificate = async (req, res) => {
  try {
    // Check if file exists
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Certificate image is required",
      });
    }

    // Upload image to cloudinary
    let certificationImage;
    try {
      certificationImage = await uploader.upload(
        file.path,
        {
          public_id: `academic-certificates/${file.originalname}`,
          folder: "academic-certificates",
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
        message: "Failed to upload certificate image. Please try again later",
        error: error.message,
      });
    }

    // Create new certificate
    const certificate = new AcademicCertification({
      name: req.body.name,
      certificationImage: certificationImage.secure_url,
    });

    // Save certificate
    await certificate.save();

    // Fetch all certificates
    const certificates = await AcademicCertification.find().sort({
      createdAt: -1,
    });

    res.status(201).json({
      success: true,
      message: "Certificate added successfully",
      data: certificates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add certificate",
      error: error.message,
    });
  }
};

// Get all certificates
const getCertificates = async (req, res) => {
  try {
    const certificates = await AcademicCertification.find().sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
      error: error.message,
    });
  }
};

// Delete certificate
const deleteCertificate = async (req, res) => {
  try {
    const certificate = await AcademicCertification.findByIdAndDelete(
      req.params.id
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // Get updated list
    const certificates = await AcademicCertification.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete certificate",
      error: error.message,
    });
  }
};

// Update certificate
const updateCertificate = async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
    };

    // Handle image update if new file is provided
    if (req.file) {
      const certificationImage = await uploader.upload(
        req.file.path,
        {
          public_id: `academic-certificates/${req.file.originalname}`,
          folder: "academic-certificates",
        },
        (error) => {
          if (error) {
            throw new Error("Image upload failed");
          } else {
            FileRemover(req.file);
          }
        }
      );
      updateData.certificationImage = certificationImage.secure_url;
    }

    const certificate = await AcademicCertification.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // Get updated list
    const certificates = await AcademicCertification.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update certificate",
      error: error.message,
    });
  }
};

// Get single certificate
const getCertificate = async (req, res) => {
  try {
    const certificate = await AcademicCertification.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificate",
      error: error.message,
    });
  }
};

module.exports = {
  postCertificate,
  getCertificates,
  deleteCertificate,
  updateCertificate,
  getCertificate,
};
