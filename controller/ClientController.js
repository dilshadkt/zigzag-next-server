const { Client } = require("../model/ClientSchema");
const { uploader } = require("../config/Cloudinary");
const FileRemover = require("../config/FileRemover/FileRemove");
const DeleteFromCloudinary = require("../config/DeleteFileCloudinary/DeleteFromCloudinary");

/////////  ADD CLIENTS ✅✅✅✅ /////////
const postClient = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("no image provided");
  const clientLogo = await uploader.upload(
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
  const client = new Client({
    image: clientLogo.url,
    name: req.body.name,
  });
  await client.save();
  const clients = await Client.find();
  res.status(200).send({ clients });
};
//////////  GET ALL CLIENT 🤡🤡🤡🤡🤡//////////
const getClients = async (req, res) => {
  const clients = await Client.find();
  res.status(200).send(clients);
};

/////// DELETE A CLIENT //////////////////
const deleteClient = async (req, res) => {
  const clientLogo = await Client.findById(req.params.clientId);
  await DeleteFromCloudinary(clientLogo.image);
  await clientLogo.deleteOne();
  const clients = await Client.find();
  res.status(200).send({ clients });
};

////// UPDATE CLIENT ////////

const updateClients = async (req, res) => {
  console.log(req.params.clientId);
  const client = await Client.findByIdAndUpdate(req.params.clientId, req.body);
  await client.save();
  const clients = await Client.find();
  res.status(200).send({ clients });
};
module.exports = { postClient, getClients, deleteClient, updateClients };
