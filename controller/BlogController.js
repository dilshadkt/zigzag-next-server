const { uploader } = require("../config/Cloudinary");
const _ = require("lodash");
const { Blog } = require("../model/BlogSchema");

//////// POST BLOG ⭐⭐⭐⭐/////////

const postBlog = async (req, res) => {
  const file = req.files;

  if (!file) return res.status(400).send("no picture privide");
  let multiPicturePromise = file.map((item) =>
    uploader.upload(item.path, { public_id: item.originalname.split(".")[0] })
  );
  const imageRespomse = await Promise.all(multiPicturePromise);
  const imgArry = imageRespomse.map((img) => img.url);

  const blog = new Blog(
    _.pick(JSON.parse(req.body.blog), [
      "test",
      "mainHead",
      "description",
      "conclustion",
      "metaDescription",
      "metaTitle",
    ])
  );
  const addImageToTes = (data, imgArray) => {
    return data.map((item) => {
      const matchingImage = imgArray.find((img) => img.includes(item.name));
      if (matchingImage) {
        item.image = matchingImage;
      }
      return item;
    });
  };
  const updatedTestwithImage = addImageToTes(blog.test, imgArry);

  blog.photos = imgArry[0];

  await blog.save();
  res.status(200).send("successfully posted blog");
};

////////// GET ALL BLOG 🔮🔮 ////////

const getBlogs = async (req, res) => {
  const blog = req.query.blogId
    ? await Blog.findById(req.query.blogId)
    : await Blog.find();

  res.status(200).send(blog);
};

/// DELELTE BLOG 🤡🤡//////////////
const deleletBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.query.blogId);
  res.status(200).send("succefully deleted");
};

////// GET LATEST BLOG 🤡🤡🤡/////////
const getLatestBlog = async (req, res) => {
  const latesBlog = await Blog.find()
    .sort({ _id: -1 })
    .limit(4)
    .select({ mainHead: 1, photos: 1 });
  if (!latesBlog) return res.status(404).send("no blog");
  res.status(200).send(latesBlog);
};

////////// UPDATE BLOG 👨‍🔧👨‍🔧👨‍🔧👨‍🔧 //////
const updatedBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.query.blogId, req.body);
  await blog.save();
  res.status(200).send(blog);
};
module.exports = {
  postBlog,
  getBlogs,
  deleletBlog,
  getLatestBlog,
  updatedBlog,
};
