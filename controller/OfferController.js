const { uploader } = require("../config/Cloudinary");
const FileRemover = require("../config/FileRemover/FileRemove");
const { Offer } = require("../model/OfferSchema");

const createOffer = async (req, res) => {
  const file = req.file;
  const { link } = req.body;
  if (!file) return res.status(400).send("image is required");

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
  const newOffer = new Offer({
    image: newImage.url,
    link,
    status: false,
  });
  await newOffer.save();
  const offers = await Offer.find();
  res.status(200).json({ offers });
};
const getAllOffer = async (req, res) => {
  const offers = await Offer.find();
  res.status(200).json({ offers });
};

const updateOffer = async (req, res) => {
  const offerId = req.params.offerId;
  const dataToUpdate = req.body;
  await Offer.findByIdAndUpdate(offerId, dataToUpdate);
  const offers = await Offer.find();
  res.status(200).json({ offers });
};

const deleteOffer = async (req, res) => {
  const offerId = req.params.offerId;
  await Offer.findByIdAndDelete(offerId);
  const offers = await Offer.find();
  res.status(200).json({ offers });
};

module.exports = { createOffer, getAllOffer, updateOffer, deleteOffer };
