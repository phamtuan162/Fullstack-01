const { User, Provider } = require("../models/index");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { Op } = require("sequelize");
const { object, string } = require("yup");
module.exports = {
  login: async (req, res) => {
    const error = req.flash("error");
    res.render("auth/login", { error, layout: "auth/layout" });
  },
  register: async (req, res) => {
    const msg = req.flash("msg");
    res.render("auth/register", { req, msg, layout: "shorten_urls/layout" });
  },
  handleRegister: async (req, res) => {
    const schema = object({
      email: string()
        .required("Vui lòng nhập email")
        .email("Email không đúng định dạng")
        .test("unique", "Email đã tồn tại trên hệ thống", async (value) => {
          const user = await User.findOne({ where: { email: value } });
          return user ? false : true;
        }),
      password: string()
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu không được ít hơn 6 ký tự"),
      name: string().required("Vui lòng nhập tên"),
    });
    try {
      const body = await schema.validate(req.body, { abortEarly: false });
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPassword = await bcrypt.hash(body.password, salt);
      await User.create({
        name: body.name,
        email: body.email,
        password: hashPassword,
      });
      req.flash("msg", "Đăng ký thành công");
    } catch (error) {
      const errors = Object.fromEntries(
        error?.inner.map((item) => [item.path, item.message])
      );

      req.flash("errors", errors);
      req.flash("old", req.body);
    }
    return res.redirect("/auth/dang-ky");
  },
};
