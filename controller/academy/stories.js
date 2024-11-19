const { uploader } = require("../../config/Cloudinary");
const FileRemover = require("../../config/FileRemover/FileRemove");
const { AcademicStories } = require("../../model/academy/stories");

// Add new story
const postStory = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    let profileImage = await uploader.upload(
      file.path,
      {
        public_id: `academic-stories/${file.originalname}`,
        folder: "academic-stories",
      },
      (error) => {
        if (error) {
          throw new Error("Image upload failed");
        } else {
          FileRemover(file);
        }
      }
    );

    const story = new AcademicStories({
      userName: req.body.userName,
      content: req.body.content,
      designation: req.body.designation,
      profileImage: profileImage.secure_url,
    });

    await story.save();
    const stories = await AcademicStories.find().sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: "Story added successfully",
      data: stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add story",
      error: error.message,
    });
  }
};

// Get all stories
const getStories = async (req, res) => {
  try {
    const stories = await AcademicStories.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stories",
      error: error.message,
    });
  }
};

// Get single story
const getStory = async (req, res) => {
  try {
    const story = await AcademicStories.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch story",
      error: error.message,
    });
  }
};

// Update story
const updateStory = async (req, res) => {
  try {
    let updateData = {
      userName: req.body.userName,
      content: req.body.content,
      designation: req.body.designation,
    };

    if (req.file) {
      const profileImage = await uploader.upload(
        req.file.path,
        {
          public_id: `academic-stories/${req.file.originalname}`,
          folder: "academic-stories",
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

    const story = await AcademicStories.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const stories = await AcademicStories.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Story updated successfully",
      data: stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update story",
      error: error.message,
    });
  }
};

// Delete story
const deleteStory = async (req, res) => {
  try {
    const story = await AcademicStories.findByIdAndDelete(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const stories = await AcademicStories.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Story deleted successfully",
      data: stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete story",
      error: error.message,
    });
  }
};

module.exports = {
  postStory,
  getStories,
  getStory,
  updateStory,
  deleteStory,
};
