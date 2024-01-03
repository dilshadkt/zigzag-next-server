const { uploader } = require("../config/Cloudinary");
const _ = require("lodash");
const { Blog } = require("../model/BlogSchema");
const cheerio = require("cheerio");

//////// POST BLOG ⭐⭐⭐⭐/////////
const postBlog = async (req, res) => {
  const file = req.files[0];

  if (!file) return res.status(400).send("no picture privide");

  const mainImage = await uploader.upload(file.path, {
    public_id: file.originalname,
  });
  const newBlog = new Blog(
    _.pick(JSON.parse(req.body.blog), ["test", "metaTitle", "metaDescription"])
  );
  newBlog.photos = mainImage.url;
  await newBlog.save();
  res.status(200).send("successfully posted blog");
};

/// DELELTE BLOG 🤡🤡//////////////

const deleletBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.query.blogId);
  res.status(200).send("succefully deleted");
};

////// GET LATEST BLOG 🤡🤡🤡/////////

const getLatestBlog = async (req, res) => {
  const latesBlog = await Blog.find().sort({ _id: -1 }).limit(4);
  const latest = latesBlog.map((item) => {
    const $ = cheerio.load(item.test);
    const heading = $("h1").text();
    return {
      _id: item._id,
      heading: heading,
      photos: item.photos,
    };
  });

  if (!latest) return res.status(404).send("no blog");
  res.status(200).send(latest);
};

////////// UPDATE BLOG 👨‍🔧👨‍🔧👨‍🔧👨‍🔧 //////
const updatedBlog = async (req, res) => {
  const dataToUpdate = req.body;
  const file = req.file;
  if (file) {
    const image = await uploader.upload(file.path, {
      public_id: file.originalname,
    });
    dataToUpdate.photos = image.url;
  }
  const blog = await Blog.findOneAndUpdate(
    { _id: req.query.blogId },
    { $set: dataToUpdate },
    { new: true }
  );

  await blog.save();
  return res.status(200).send(blog);
};

///////////   GET ALL  BLOG ////////////
const getAllTestBlog = async (req, res) => {
  if (req.query.blogId) {
    const blog = await Blog.findById(req.query.blogId);
    if (!blog) return res.status(400).send("ther is no blog with this id");
    res.status(200).send(blog);
  } else {
    const blog = await Blog.find();
    if (!blog) return res.status(400).send("ther is no blog with this id");
    const data = blog.map((item) => {
      const $ = cheerio.load(item.test);
      const heading = $("h1").text();
      const description = $("p").text();
      return {
        heading: heading,
        description: description,
        photos: item.photos,
        _id: item._id,
      };
    });
    res.status(200).send(data);
  }
};

module.exports = {
  postBlog,
  deleletBlog,
  getLatestBlog,
  updatedBlog,
  getAllTestBlog,
};
