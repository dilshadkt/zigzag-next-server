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
const seoRoute = require("./router/seo");
const categoryRout = require("./router/category");
const offerRoute = require("./router/offer");
const careerRoute = require("./router/career");
const leadRoute = require("./router/lead");
const contactLead = require("./router/contactLead");

const academicTestmonialRoute = require("./router/academy/testmonial");
const academicCertificateRoute = require("./router/academy/certificate");
const academicStoriesRoute = require("./router/academy/stories");
const academicPlacementRoute = require("./router/academy/placement");
const academicContactLeadRoutes = require("./router/academy/contact");
const academicGalleryRoutes = require("./router/academy/gallery");
const academicBlogRoutes = require("./router/academy/blog");
const academicPageRoutes = require("./router/academy/page");
const eventRouter = require("./router/academy/event");
const userRoutes = require("./router/userRoute");

const { cloudinaryConfig } = require("./config/Cloudinary");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connection is good"))
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
app.use("/seo", seoRoute);
app.use("/verifyLogin", loginRout);
app.use("/category", categoryRout);
app.use("/offer", offerRoute);
app.use("/career", careerRoute);
app.use("/lead", leadRoute);
app.use("/contact", contactLead);
app.use("/user", userRoutes);
// academic
app.use("/academic/testimonial", academicTestmonialRoute);
app.use("/academic/certificate", academicCertificateRoute);
app.use("/academic/stories", academicStoriesRoute);
app.use("/academic/placement", academicPlacementRoute);
app.use("/academic/contact-leads", academicContactLeadRoutes);
app.use("/academic/gallery", academicGalleryRoutes);
app.use("/academic/blogs", academicBlogRoutes);
app.use("/academic/pages", academicPageRoutes);
app.use("/academic/events", eventRouter);

app.listen(process.env.PORT || 5000, () =>
  console.log(`server is running on port  ${process.env.PORT}`)
);

module.exports = app;
