const { uploader } = require("../config/Cloudinary");
const DeleteFromCloudinary = require("../config/DeleteFileCloudinary/DeleteFromCloudinary");
const FileRemover = require("../config/FileRemover/FileRemove");
const { Expert } = require("../model/ExpertSchema");
const fs = require("fs");
const addExperts = async (req, res) => {
  let file = req.file;
  if (!file) return res.status(400).send("no picture attached");
  const newImage = await uploader.upload(
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
  const newExpert = new Expert({
    image: newImage.url,
    name: req.body.name,
    role: req.body.role,
  });
  await newExpert.save();
  const experts = await Expert.find();
  res.status(200).json({ experts });
};
///////// ALL EXPERTS 🥸🥸🥸////////

const getAllExperts = async (req, res) => {
  const experts = await Expert.find();
  res.send(experts);
};
///////// DELETE EXPERTS 👻👻👻///////
const deleteExpert = async (req, res) => {
  const id = req.params.expertId;
  const expert = await Expert.findById(id);
  await DeleteFromCloudinary(expert.image);
  await expert.deleteOne();
  if (!expert) return res.status(400).send("ther is no expert");
  const experts = await Expert.find();
  res.status(200).json({ experts });
};
///// UPDATE EXPERTS 👨‍🔧👨‍🔧👨‍🔧👨‍🔧/////////
const updateExperts = async (req, res) => {
  const file = req.file;
  const expertId = req.params.expertId;
  const dataToUpdate = req.body;

  if (file) {
    const image = await uploader.upload(
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
    dataToUpdate.image = image.url;
    const expert = await Expert.findById(expertId);
    await DeleteFromCloudinary(expert.image);
  }
  const expert = await Expert.findByIdAndUpdate(
    req.params.expertId,
    dataToUpdate
  );
  await expert.save();
  const experts = await Expert.find();
  res.status(200).json({ experts });
};
const changeOrder = async (req, res) => {
  const { data } = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).send("Invalid data format");
  }
  await Expert.deleteMany({});
  await Expert.insertMany(data);
  res.send("Data updated successfully");
};

module.exports = {
  addExperts,
  getAllExperts,
  deleteExpert,
  updateExperts,
  changeOrder,
};
