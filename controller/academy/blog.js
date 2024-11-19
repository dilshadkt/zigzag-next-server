const { uploader } = require("../../config/Cloudinary");
const FileRemover = require("../../config/FileRemover/FileRemove");
const { AcademicBlog } = require("../../model/academy/blog");

// Create new blog
const createBlog = async (req, res) => {
  try {
    // Check if file exists
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      });
    }

    // Upload banner image to cloudinary
    let blogBannerImage;
    try {
      blogBannerImage = await uploader.upload(
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

    // Create new blog
    const blog = new AcademicBlog({
      title: req.body.title,
      blogBannerImage: blogBannerImage.secure_url,
      content: req.body.content,
      path: req.body.path,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      metaKeywords: req.body.metaKeywords
        ?.split(",")
        .map((keyword) => keyword.trim()),
      ogTitle: req.body.ogTitle,
      ogDescription: req.body.ogDescription,
      status: req.body.status || "draft",
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    const blogs = await AcademicBlog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await AcademicBlog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// Get single blog by ID or path
const getBlog = async (req, res) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { path: req.params.id };

    const blog = await AcademicBlog.findOne(query);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};
const getBlogsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Validate status
    const validStatuses = ["draft", "published", "archived"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status parameter",
      });
    }

    // Fetch blogs with the specified status
    const blogs = await AcademicBlog.find({ status })
      .sort({ createdAt: -1 })
      .select({
        title: 1,
        blogBannerImage: 1,
        content: 1,
        path: 1,
        status: 1,
        createdAt: 1,
        metaDescription: 1,
      });

    res.status(200).json({
      success: true,
      message: `Successfully fetched ${status} blogs`,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs by status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    let updateData = {
      title: req.body.title,
      content: req.body.content,
      path: req.body.path,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      metaKeywords: req.body.metaKeywords
        ?.split(",")
        .map((keyword) => keyword.trim()),
      ogTitle: req.body.ogTitle,
      ogDescription: req.body.ogDescription,
      status: req.body.status,
    };

    // Handle banner image update if new file is provided
    if (req.file) {
      const blogBannerImage = await uploader.upload(
        req.file.path,
        {
          public_id: `blog-banners/${req.file.originalname}`,
          folder: "blog-banners",
        },
        (error) => {
          if (error) {
            throw new Error("Image upload failed");
          } else {
            FileRemover(req.file);
          }
        }
      );
      updateData.blogBannerImage = blogBannerImage.secure_url;
    }

    const blog = await AcademicBlog.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await AcademicBlog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete banner image from Cloudinary
    if (blog.blogBannerImage) {
      try {
        const publicId = blog.blogBannerImage.split("/").pop().split(".")[0];
        await uploader.destroy(`blog-banners/${publicId}`);
      } catch (error) {
        console.error("Error deleting banner image:", error);
      }
    }

    await AcademicBlog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getBlogsByStatus,
};
