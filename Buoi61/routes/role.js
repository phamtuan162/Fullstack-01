var express = require("express");
var router = express.Router();
const roleController = require("../controllers/role.controller");
const permission = require("../middlewares/permission.middleware");

router.get("/", permission("roles.read"), roleController.index);
router.get("/add", permission("roles.add"), roleController.add);
router.post("/add", permission("roles.add"), roleController.handleAdd);
router.get("/edit/:id", permission("roles.edit"), roleController.edit);
router.post("/edit/:id", permission("roles.edit"), roleController.handleEdit);
router.post("/delete/:id", permission("roles.delete"), roleController.delete);
module.exports = router;
