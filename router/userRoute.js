// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");

// Routes for user management
router.post("/", userController.createUser);
router.post("/login", userController.login);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/:id/change-password", userController.changePassword);

module.exports = router;
