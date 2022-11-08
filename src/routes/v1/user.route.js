const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");

const router = express.Router();

router.get("/", auth("getUsers"), validate(userValidation.getUsers), userController.getAllUsers);
router.get("/:id", auth("getUser"), validate(userValidation.getUser), userController.getUser);
router.put("/:id", auth("updateUsers"), validate(userValidation.updateUser), userController.updateUser);
router.delete("/", auth("deleteUser"), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
