const { uploader } = require("../../config/Cloudinary");
const DeleteFromCloudinary = async (image) => {
  const photoAssetId = image
    .split("/")
    [image.split("/").length - 1].slice(0, -4);
  const decodedName = decodeURIComponent(photoAssetId);
  await uploader.destroy(decodedName);
};

module.exports = DeleteFromCloudinary;
