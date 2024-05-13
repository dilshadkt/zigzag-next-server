const { Seo } = require("../model/SeoSchema");
const { uploader } = require("../config/Cloudinary");
const _ = require("lodash");
const fs = require("fs");

const PostSeoContent = async (req, res) => {
  const file = req.files[0];
  const image = await uploader.upload(
    file.path,
    {
      public_id: file.originalname,
    },
    (error) => {
      if (error) {
        res.status(400).send(error);
      } else {
        fs.unlink(`./uploads/${file.filename}`, (err) => {
          if (err) {
            console.error("Error removing directory:", err);
            return;
          }
        });
      }
    }
  );
  const newContent = new Seo(
    _.pick(JSON.parse(req.body.blog), [
      "test",
      "metaTitle",
      "path",
      "ogDescription",
      "metaDescription",
      "metaKeyWord",
      "ogTitle",
    ])
  );
  newContent.photos = image.url;
  await newContent.save();
  res.status(200).send("successfully posted blog");
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
  res.status(200).send(blog);
};

const deleteContent = async (req, res) => {
  const id = req.query.contentId;
  const content = await Seo.findById(id);
  await content.deleteOne();
  const photoAssetId = content.photos
    .split("/")
    [content.photos.split("/").length - 1].slice(0, -4);
  const decodedName = decodeURIComponent(photoAssetId);
  await uploader.destroy(decodedName);
  res.status(200).json({ message: "successfully deleted" });
};

const updateContent = async (req, res) => {
  const contentId = req.query.contentId;
  const contentToUpdate = req.body;
  const imageFileToUpload = req.file;
  if (imageFileToUpload) {
    const image = await uploader.upload(
      imageFileToUpload.path,
      {
        public_id: imageFileToUpload.originalname,
      },
      (error) => {
        if (error) {
          res.status(400).json({ error });
        } else {
          fs.unlink(`./uploads/${imageFileToUpload.filename}`, (err) => {
            if (err) {
              console.error("Error removing directory:", err);
              return;
            }
          });
        }
      }
    );
    contentToUpdate.photos = image.url;
    const content = await Seo.findById(contentId);
    const photoAssetId = content.photos
      .split("/")
      [content.photos.split("/").length - 1].slice(0, -4);
    const decodedName = decodeURIComponent(photoAssetId);
    await uploader.destroy(decodedName);
  }

  const newContent = await Seo.findOneAndUpdate(
    {
      _id: contentId,
    },
    { $set: contentToUpdate },
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
