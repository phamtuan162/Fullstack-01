const { Op } = require("sequelize");
const { User, Role } = require("../models/index");
const { isRole } = require("../utils/permission.utils");

module.exports = {
  index: async (req, res) => {
    const msg = req.flash("msg");

    const limit = 3;
    const { page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const { rows: users, count } = await User.findAndCountAll({
      order: [["id", "desc"]],
      limit,
      offset,
    });
    const totalPage = Math.ceil(count / limit);

    res.render("users/index", {
      users,
      totalPage,
      page,
      req,
      msg,
    });
  },

  permission: async (req, res, next) => {
    const msg = req.flash("msg");
    const { id } = req.params;
    try {
      const user = await User.findOne({
        where: {
          id,
        },
        include: {
          model: Role,
          as: "roles",
        },
      });
      if (!user) {
        throw new Error("User không tồn tại");
      }
      const roles = await Role.findAll();
      res.render("users/rolePermission", {
        msg,
        req,
        roles,
        user,
        isRole,
      });
    } catch (e) {
      next(e);
    }
  },
  handlePermission: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const rolePermissions = !Array.isArray(body.rolePermission)
      ? [body.rolePermission]
      : body.rolePermission;
    try {
      if (rolePermissions.length) {
        const rolePermissionsRequest = await Promise.all(
          rolePermissions.map((rolePermissionId) =>
            Role.findByPk(rolePermissionId)
          )
        );
        const user = await User.findByPk(id);
        await user?.setRoles(rolePermissionsRequest);
        req.flash("msg", "Phân quyền người dùng thành công");
      }

      return res.redirect("/users/permission/" + id);
    } catch (e) {
      return next(e);
    }
  },
  handleDelete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id, {
        include: "roles",
      });

      if (user) {
        await user.removeRoles(user.roles);
        await user.destroy();

        req.flash("msg", "Xóa user thành công");
      }

      return res.redirect("/users");
    } catch (e) {
      next(e);
    }
  },
};
