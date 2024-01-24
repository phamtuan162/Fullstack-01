var express = require("express");
var router = express.Router();
const model = require("../models/index");
const User = model.User;
const userController = require("../controllers/user.controller");

/* GET users listing. */

router.get("/", userController.index);

router.get("/permission/:id", userController.permission);
router.post("/permission/:id", userController.handlePermission);
router.post("/delete/:id", userController.handleDelete);

module.exports = router;
