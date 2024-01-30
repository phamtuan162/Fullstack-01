const { object, string } = require("yup");
const shortId = require("shortid");
const { ShortenUrl, User } = require("../models/index");
const moment = require("moment");
module.exports = {
  index: async (req, res) => {
    const msg = req.flash("msg");
    const id = req.user.id;
    const my_url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const user = await User.findOne({
      where: { id },
      include: {
        model: ShortenUrl,
        as: "shorten_urls",
      },
    });
    if (!user) {
      throw new Error("User không tồn tại");
    }
    res.render("shorten_urls/index", {
      req,
      msg,
      user,
      moment,
      my_url,
      layout: "shorten_urls/layout",
    });
  },
  edit: async (req, res) => {
    const msg = req.flash("msg");
    const { id: short_id } = req.params;
    const id = req.user.id;
    const my_url = `${req.protocol}://${req.get("host")}`;
    const user = await User.findOne({
      where: { id },
      include: {
        model: ShortenUrl,
        as: "shorten_urls",
      },
    });
    if (!user) {
      throw new Error("User không tồn tại");
    }
    const link = await ShortenUrl.findOne({
      where: {
        short_url: short_id,
      },
    });

    if (!link) {
      throw new Error("Link không tồn tại");
    }
    res.render("shorten_urls/edit", {
      req,
      msg,
      user,
      moment,
      my_url,
      link,
      layout: "shorten_urls/layout",
    });
  },
  handleEdit: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const schema = object({
      password: string().max(16, "Mật khẩu tối đa 16 ký tự"),
    });
    try {
      const body = await schema.validate(req.body, { abortEarly: false });

      ShortenUrl.update(
        {
          password: body.password,
        },
        {
          where: {
            short_url: id,
          },
        }
      );

      req.flash("msg", "Sửa thành công");
    } catch (error) {
      const errors = Object.fromEntries(
        error?.inner.map((item) => [item.path, item.message])
      );

      req.flash("errors", errors);
      req.flash("old", req.body);
    }

    return res.redirect("/shorten-urls/edit/" + id);
  },
  delete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const link = await ShortenUrl.findOne({
        where: {
          short_url: id,
        },
      });

      if (link) {
        await link.destroy();
      }

      return res.redirect("/shorten-urls");
    } catch (e) {
      next(e);
    }
  },

  handleAddShortenUrl: async (req, res) => {
    const body = req.body;

    const { link, password, safe_navigation } = body;
    const schema = object({
      link: string()
        .required("Vui lòng nhập liên kết")
        .url("Vui lòng nhập liên kết hợp lệ")
        .test("unique-link", "Liên kết này đã được rút gọn", async (value) => {
          const existingShortenUrl = await ShortenUrl.findOne({
            where: {
              full_url: value,
            },
          });
          return !existingShortenUrl;
        }),
      password: string().max(16, "Mật khẩu tối đa 16 ký tự"),
    });

    try {
      const body = await schema.validate(req.body, { abortEarly: false });

      const shorten_url = ShortenUrl.create({
        full_url: link,
        short_url: shortId.generate(link),
        clicks: 0,
        user_id: req.user.id,
        safe: safe_navigation === "1" ? true : false,
        password: password,
      });

      req.flash("msg", "Rút gọn liên kết thành công");
    } catch (error) {
      const errors = Object.fromEntries(
        error?.inner.map((item) => [item.path, item.message])
      );

      req.flash("errors", errors);
      req.flash("old", req.body);
    }

    return res.redirect("/shorten-urls");
  },
  redirectShortenUrl: async (req, res, next) => {
    const { id } = req.params;
    try {
      const link = await ShortenUrl.findOne({
        where: {
          short_url: id,
        },
      });
      if (!link) {
        throw new Error("Link không tồn tại hoặc không hợp lệ");
      }
      await ShortenUrl.update(
        {
          clicks: ++link.clicks,
        },
        {
          where: {
            short_url: id,
          },
        }
      );
      if (link.password) {
        return res.redirect("/shorten-urls/password/" + id);
      } else {
        if (link.safe) {
          return res.redirect("/shorten-urls/safe/" + id);
        } else {
          return res.redirect(`${link.full_url}`);
        }
      }
    } catch (e) {
      next(e);
    }
  },
  handleRedirectShortenUrl: async (req, res) => {},
  passwordShortenUrl: async (req, res) => {
    res.render("shorten_urls/password", { req, layout: "shorten_urls/layout" });
  },
  handlePasswordShortenUrl: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const schema = object({
      password: string()
        .required("Nhập mật khẩu để mở liên kết")
        .test("password", "Mật khẩu không đúng", async (value) => {
          const check = await ShortenUrl.findOne({
            where: {
              password: value,
            },
          });
          return check ? true : false;
        }),
    });

    try {
      const body = await schema.validate(req.body, { abortEarly: false });
      const link = await ShortenUrl.findOne({
        where: {
          short_url: id,
        },
      });
      if (!link) {
        throw new Error("Link không tồn tại hoặc không hợp lệ");
      }
      return res.redirect(`${link.full_url}`);
    } catch (error) {
      const errors = Object.fromEntries(
        error?.inner.map((item) => [item.path, item.message])
      );

      req.flash("errors", errors);
      req.flash("old", req.body);
    }

    return res.redirect("/shorten-urls/password/" + id);
  },
  safeShortenUrl: async (req, res) => {
    const { id } = req.params;
    res.render("shorten_urls/safe", { req, layout: "shorten_urls/layout" });
  },
};
