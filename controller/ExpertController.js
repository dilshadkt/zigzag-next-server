const { uploader } = require("../config/Cloudinary");
const { Expert } = require("../model/ExpertSchema");

const addExperts = async (req, res) => {
  let file = req.file;
  if (!file) return res.status(400).send("no picture attached");
  const newImage = await uploader.upload(file.path, {
    public_id: file.originalname,
  });
  const newExpert = new Expert({
    image: newImage.url,
    name: req.body.name,
    role: req.body.role,
  });
  await newExpert.save();
  res.status(200).send(newImage.url);
};
///////// ALL EXPERTS 🥸🥸🥸////////

const getAllExperts = async (req, res) => {
  const experts = await Expert.find();
  res.send(experts);
};
///////// DELETE EXPERTS 👻👻👻///////
const deleteExpert = async (req, res) => {
  const expert = await Expert.findByIdAndDelete(req.params.expertId);
  if (!expert) return res.status(400).send("ther is no expert");

  res.status(200).send("successfully deleted");
};
///// UPDATE EXPERTS 👨‍🔧👨‍🔧👨‍🔧👨‍🔧/////////
const updateExperts = async (req, res) => {
  const expert = await Expert.findByIdAndUpdate(req.params.expertId, req.body);
  await expert.save();
  res.status(200).send("succefully updated");
};

module.exports = { addExperts, getAllExperts, deleteExpert, updateExperts };
