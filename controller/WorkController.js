const { uploader } = require("../config/Cloudinary");
const fs = require("fs");
const { Work } = require("../model/WorkSchema");
const FileRemover = require("../config/FileRemover/FileRemove");
const DeleteFromCloudinary = require("../config/DeleteFileCloudinary/DeleteFromCloudinary");

/////////   ADD NEW WORK   //////////////
const postWork = async (req, res) => {
  let file = req.files[0];
  if (!file) return res.status(400).send("no picture attached");
  const Newimage = await uploader.upload(
    file.path,
    {
      public_id: file.originalname,
    },
    (error) => {
      if (error) {
        res.status(400).send(error);
      } else {
        FileRemover(file);
      }
    }
  );
  const newAddedImage = new Work({
    image: Newimage.url,
    type: req.body.category,
    stared: req.body.star,
  });
  await newAddedImage.save();
  res.status(201).send(Newimage.url);
};
/////// GET ALL WORK ///////////
const getAllWork = async (req, res) => {
  if (req.query.type) {
    const filteredWorkd = await Work.find({ stared: req.query.type });
    res.status(200).send(filteredWorkd);
  } else {
    const allWorks = await Work.find();
    res.status(200).send(allWorks);
  }
};

/////// DELETE WORK  /////////////
const deleteWork = async (req, res) => {
  const work = await Work.findById(req.params.worksId);
  await DeleteFromCloudinary(work.image);

  await Work.findByIdAndDelete(req.params.worksId);

  res.status(200).send("successfully dleleted");
};

////// UPDATE WORK //////////////
const updateWorks = async (req, res) => {
  const work = await Work.findByIdAndUpdate(req.params.worksId, req.body);
  await work.save();
  res.status(200).send("works updated");
};

///// GET LATEST WOEK ////////
const getLatestWorkd = async (req, res) => {
  const latestWork = await Work.find().sort({ _id: -1 }).limit(4);
  res.status(200).send(latestWork);
};
module.exports = {
  postWork,
  getAllWork,
  deleteWork,
  updateWorks,
  getLatestWorkd,
};
