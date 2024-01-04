const express = require("express");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const workRout = require("./router/work");
const expertRout = require("./router/expert");
const clietnRout = require("./router/clients");
const blogRouter = require("./router/blogs");
const testimonialRout = require("./router/testimonial");
const loginRout = require("./router/loginRout");
const { cloudinaryConfig } = require("./config/Cloudinary");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => "connection is good")
  .catch((err) => console.log(err));
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use("*", cloudinaryConfig);
app.use("/work", workRout);
app.use("/experts", expertRout);
app.use("/clients", clietnRout);
app.use("/blogs", blogRouter);
app.use("/testimonial", testimonialRout);
app.use("/verifyLogin", loginRout);
app.listen(process.env.PORT || 5000, () =>
  console.log(`server is running on port  ${process.env.PORT}`)
);

module.exports = app;
