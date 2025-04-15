// controllers/userController.js
const User = require("../model/UserSchema");

exports.createUser = async (req, res) => {
  try {
    const { username, password, access } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password

    // Create new user
    const user = await User.create({
      username,
      password,
      access: access || ["user"],
    });

    // Return the user without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      access: user.access,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search parameter
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");

    // Build filter criteria
    const filter = search ? { username: searchRegex } : {};

    // Get users with pagination
    const users = await User.find(filter)
      .select("-password") // Exclude password
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.status(200).json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    // Pagination parameters

    const { email, password } = req.body;
    const user = await User.findOne({ username: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    if (user.password !== password) {
      return res
        .status(400)
        .json({ message: "Invalid Password", success: false });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Failed to Login");
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user by ID:", error);

    // Handle invalid ObjectId
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, password, access } = req.body;
    const userId = req.params.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Update user fields
    user.username = username || user.username;
    user.access = access || user.access;

    // Only update password if provided
    if (password) {
      (user.password = password), salt;
    }

    // Save updated user
    const updatedUser = await user.save();

    // Return user without password
    const userResponse = {
      _id: updatedUser._id,
      username: updatedUser.username,
      access: updatedUser.access,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error updating user:", error);

    // Handle invalid ObjectId
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res
      .status(200)
      .json({ message: "User removed successfully", id: req.params.id });
  } catch (error) {
    console.error("Error deleting user:", error);

    // Handle invalid ObjectId
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
