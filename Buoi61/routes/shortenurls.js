var express = require("express");
var router = express.Router();
const shortenUrlsController = require("../controllers/shortenUrl.controller");

router.get("/", shortenUrlsController.index);
router.post("/", shortenUrlsController.handleAddShortenUrl);
router.get("/:id", shortenUrlsController.redirectShortenUrl);
router.get("/edit/:id", shortenUrlsController.edit);
router.post("/edit/:id", shortenUrlsController.handleEdit);
router.post("/delete/:id", shortenUrlsController.delete);
router.get("/password/:id", shortenUrlsController.passwordShortenUrl);
router.post("/password/:id", shortenUrlsController.handlePasswordShortenUrl);
router.get("/safe/:id", shortenUrlsController.safeShortenUrl);

// router.post("/:id", shortenUrlsController.handleRedirectShortenUrl);
module.exports = router;
