module.exports = (req, res, next) => {
  const pathname = req.baseUrl + req.path;

  if (!req.user || pathname === "/auth/logout") {
    return next();
  }
  return res.redirect("/");
};
