module.exports = (req, res, next) => {
  const pathname = req.baseUrl + req.path;
  if (req.user) {
    return next();
  }
  if (
    pathname.includes("/shorten-urls/safe/") ||
    pathname.includes("/shorten-urls/password/")
  ) {
    return next();
  }
  return res.redirect("/auth/dang-nhap");
};
