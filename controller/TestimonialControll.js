const e = require("express");
const { uploader } = require("../config/Cloudinary");
const FileRemover = require("../config/FileRemover/FileRemove");
const { Testimonial } = require("../model/Testimonial");
const _ = require("lodash");
const DeleteFromCloudinary = require("../config/DeleteFileCloudinary/DeleteFromCloudinary");

/////// POST TESTIMONIAL 🚀🚀🚀 ///////////
const postTestimonial = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("no file attached");
  image = await uploader.upload(
    file.path,
    {
      public_id: file.originalname,
    },
    (error) => {
      if (error) {
        res.status(400).json({ error });
      } else {
        FileRemover(file);
      }
    }
  );
  if (!image)
    return res
      .status(400)
      .send("sorry server is busy for uploading files ,try later");
  const testimonial = new Testimonial(
    _.pick(req.body, ["name", "description", "designation", "color", "role"])
  );
  testimonial.photos = image.url;
  await testimonial.save();
  res.status(200).send("successfully added new testimonial");
};

////// GET ALL TESTIMONIAL 🤡🤡🤡 //////
const getTestimonial = async (req, res) => {
  const testimonial = await Testimonial.find();
  res.status(200).send(testimonial);
};

///// DELETE TESTIMONIALS 👽👽 ///////
const deleteTestimonial = async (req, res) => {
  const testMonial = await Testimonial.findById(req.params.id);
  await DeleteFromCloudinary(testMonial.photos);
  await testMonial.deleteOne();
  res.status(200).send("succefully removed");
};

///// UPDATE TESTIMONIALS ✅✅✅✅ //////
const updateTestimonias = async (req, res) => {
  const testimonials = await Testimonial.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  await testimonials.save();
  res.status(200).send("succefully  updated");
};
module.exports = {
  postTestimonial,
  getTestimonial,
  deleteTestimonial,
  updateTestimonias,
};
