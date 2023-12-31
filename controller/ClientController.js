const { Client } = require("../model/ClientSchema");
const { uploader } = require("../config/Cloudinary");

/////////  ADD CLIENTS ✅✅✅✅ /////////
const postClient = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("no image provided");
  const clientLogo = await uploader.upload(file.path);
  const clients = new Client({
    image: clientLogo.url,
    name: req.body.name,
  });
  await clients.save();
  res.status(200).send(clientLogo.url);
};
//////////  GET ALL CLIENT 🤡🤡🤡🤡🤡//////////
const getClients = async (req, res) => {
  const clients = await Client.find();
  res.status(200).send(clients);
};

/////// DELETE A CLIENT //////////////////
const deleteClient = async (req, res) => {
  await Client.findByIdAndDelete(req.params.clientId);
  res.status(200).send("succefully deleted");
};

const updateClients = async (req, res) => {
  console.log(req.params.clientId);
  const clients = await Client.findByIdAndUpdate(req.params.clientId, req.body);
  await clients.save();
  res.status(200).send("succesfully updated");
};
module.exports = { postClient, getClients, deleteClient, updateClients };
