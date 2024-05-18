const { Seo } = require("../model/SeoSchema");
const { uploader } = require("../config/Cloudinary");
const _ = require("lodash");
const fs = require("fs");
const FileRemover = require("../config/FileRemover/FileRemove");

const PostSeoContent = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const images = req.files;
  if (images.length !== 0) {
    const imageUrls = await Promise.all(
      images.map((image) =>
        uploader.upload(image.path).then((response) => response.url)
      )
    );
    images.forEach((image) => FileRemover(image));
    data.page.forEach((page, index) => {
      if (imageUrls[index]) {
        page.image = imageUrls[index];
      }
    });
  }

  const metaData = _.pick(data.metaData, [
    "metaTitle",
    "ogTitle",
    "path",
    "ogDescription",
    "metaDescription",
    "metaKeyWord",
  ]);
  const newPageData = { ...metaData, page: data.page };
  const newPage = new Seo(newPageData);

  await newPage.save();
  const pages = await Seo.find();
  res.status(200).send({ pages });
};
const deleteImage = async (req, res) => {
  const imageId = req.params.imageId;
  await uploader.destroy(imageId, () => {});
};

const getSeoContent = async (req, res) => {
  const content = await Seo.find();
  res.status(200).json({ content });
};

const getBlog = async (req, res) => {
  const blogPath = req.params.blogPath;
  const blog = await Seo.findOne({ path: blogPath });
  if (!blog) return res.status(404).send("page not found");
  res.status(200).send(blog);
};

const deleteContent = async (req, res) => {
  const id = req.query.contentId;
  const content = await Seo.findById(id);
  await content.deleteOne();
  // const photoAssetId = content.photos
  //   .split("/")
  //   [content.photos.split("/").length - 1].slice(0, -4);
  // const decodedName = decodeURIComponent(photoAssetId);
  // await uploader.destroy(decodedName);
  res.status(200).json({ message: "successfully deleted" });
};

const updateContent = async (req, res) => {
  const contentId = req.query.contentId;
  const contentToUpdate = JSON.parse(req.body.updation);
  const images = req.files;
  const indexArray = [req.body.index];

  if (images.length !== 0) {
    const imageUrls = await Promise.all(
      images.map((image) =>
        uploader
          .upload(image.path, {
            public_id: image.originalname,
          })
          .then((response) => response.url)
      )
    );
    images.forEach((image) => FileRemover(image));
    indexArray.forEach((index, i) => {
      const currentItem = contentToUpdate.page[index];
      currentItem.image = imageUrls[i];
    });
  }

  const { metaData, page } = contentToUpdate;
  const upation = { ...metaData, page };
  const newContent = await Seo.findOneAndUpdate(
    {
      _id: contentId,
    },
    { $set: upation },
    { new: true }
  );
  await newContent.save();
  return res.status(200).send(newContent);
};
module.exports = {
  PostSeoContent,
  deleteImage,
  getSeoContent,
  getBlog,
  deleteContent,
  updateContent,
};
