const { uploader } = require("../../config/Cloudinary");
const FileRemover = require("../../config/FileRemover/FileRemove");
const { AcademicEvents } = require("../../model/academy/events");

// Add new story
const postEvent = async (req, res) => {
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

    const event = new AcademicEvents({
      name: req.body.name,
      time: req.body.time,
      date: req.body.date,
      description: req.body.description,
      profileImage: profileImage.secure_url,
    });

    await event.save();
    const events = await AcademicEvents.find().sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: "Event added successfully",
      data: events,
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
const getEvents = async (req, res) => {
  try {
    const events = await AcademicEvents.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

// Get single story
const getEvent = async (req, res) => {
  try {
    const event = await AcademicEvents.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

// Update story
const updateEvent = async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
      time: req.body.time,
      date: req.body.date,
      description: req.body.description,
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

    const event = await AcademicEvents.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const events = await AcademicEvents.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Story updated successfully",
      data: events,
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
const deleteEvent = async (req, res) => {
  try {
    const event = await AcademicEvents.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const events = await AcademicEvents.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Event",
      error: error.message,
    });
  }
};

module.exports = {
  postEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};
