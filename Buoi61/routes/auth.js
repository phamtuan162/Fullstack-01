var express = require("express");
var router = express.Router();
const authController = require("../controllers/auth.controller");
const passport = require("passport");
router.get("/dang-nhap", authController.login);
router.post(
  "/dang-nhap",
  passport.authenticate("local", {
    failureRedirect: "/auth/dang-nhap",
    failureFlash: true,
    successRedirect: "/",
  })
);
router.get("/logout", (req, res) => {
  req.logout(() => {});
  return res.redirect("/auth/dang-nhap");
});
router.get("/google/redirect", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/dang-nhap",
    failureFlash: true,
    successRedirect: "/",
  })
);

router.get("/dang-ky", authController.register);
router.post("/dang-ky", authController.handleRegister);
module.exports = router;
