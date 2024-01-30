var express = require("express");
var router = express.Router();
const model = require("../models/index");
const User = model.User;
const userController = require("../controllers/user.controller");
const permission = require("../middlewares/permission.middleware");

/* GET users listing. */

router.get("/", permission("users.read"), userController.index);

router.get("/permission/:id", userController.permission);
router.post("/permission/:id", userController.handlePermission);
router.post(
  "/delete/:id",
  permission("users.delete"),
  userController.handleDelete
);

module.exports = router;
