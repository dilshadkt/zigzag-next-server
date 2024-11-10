const { Career } = require("../model/CareerSchema");
const _ = require("lodash");

//Add career
const addCareer = async (req, res) => {
  const careerData = _.pick(req.body, [
    "title",
    "experience",
    "deadline",
    "skills",
  ]);
  const newCareer = new Career(careerData);
  const newlyAddedCareer = await newCareer.save();
  res.status(200).json({ career: newlyAddedCareer });
};
//GET career
const getCareers = async (req, res) => {
  const careers = await Career.find();
  res.status(200).json({ careers });
};
//GET specific career
const getCareer = async (req, res) => {
  const { careerId } = req.params;
  const career = await Career.findById(careerId);
  if (!career) {
    return res.status(404).send({ message: "Career not found" });
  }
  res.status(200).json({ career });
};
//Update Career
const updatedCareer = async (req, res) => {
  const { careerId } = req.params;
  const changes = req.body;
  const newCareer = await Career.findByIdAndUpdate(careerId, changes, {
    new: true,
  });
  if (!newCareer) {
    return res.status(404).send({ message: "Career not found" });
  }
  res.send(newCareer);
};
//Delete Career
const deleteCareer = async (req, res) => {
  const { careerId } = req.params;
  const deletedCareer = await Career.findByIdAndDelete(careerId);

  if (!deletedCareer) {
    return res.status(404).send({ message: "Career not found" });
  }
  res.status(200).send({
    message: "Career successfully deleted",
    deletedCareer,
  });
};
module.exports = {
  addCareer,
  getCareers,
  updatedCareer,
  deleteCareer,
  getCareer,
};
