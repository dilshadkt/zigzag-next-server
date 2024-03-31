const fs = require("fs");
const FileRemover = (file) => {
  fs.unlink(`./uploads/${file.filename}`, (err) => {
    if (err) {
      console.error("Error removing directory:", err);
      return;
    }
  });
};
module.exports = FileRemover;
