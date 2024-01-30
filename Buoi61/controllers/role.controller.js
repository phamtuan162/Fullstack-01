const { Role, User, Permission } = require("../models/index");
const { object, string } = require("yup");
const { isPermission } = require("../utils/permission.utils");
const { Op } = require("sequelize");

module.exports = {
  index: async (req, res) => {
    const msg = req.flash("msg");

    const roles = await Role.findAll({
      order: [["name", "asc"]],
    });
    res.render("roles/index", { req, roles, msg });
  },
  add: async (req, res) => {
    const msg = req.flash("msg");

    res.render("roles/add", { msg, req });
  },
  handleAdd: async (req, res, next) => {
    const body = req.body;
    const permissions = !Array.isArray(body.permissions)
      ? [body.permissions]
      : body.permissions;
    const schema = object({
      name: string()
        .required("Vui lòng nhập tên role")
        .test("unique", "Role đã tồn tại ", async (value) => {
          const role = await Role.findOne({ where: { name: value } });
          return role ? false : true;
        }),
    });
    try {
      const body = await schema.validate(req.body, { abortEarly: false });
      const role = await Role.create({
        name: body.name,
      });
      if (role) {
        if (permissions.length) {
          for (let i = 0; i < permissions.length; i++) {
            const [permission] = await Permission.findOrCreate({
              where: {
                value: permissions[i].trim(),
              },
              defaults: {
                value: permissions[i].trim(),
              },
            });
            await role.addPermission(permission);
          }
        }
        req.flash("msg", "Thêm role thành công");
      }
    } catch (error) {
      const errors = Object.fromEntries(
        error?.inner.map((item) => [item.path, item.message])
      );
      req.flash("errors", errors);
      req.flash("old", req.body);
    }
    return res.redirect("/roles/add");
  },
  edit: async (req, res) => {
    const { id } = req.params;
    const msg = req.flash("msg");

    try {
      const roles = await Role.findAll({
        order: [["name", "desc"]],
      });
      const role = await Role.findOne({
        where: { id },
        include: {
          model: Permission,
          as: "permissions",
        },
      });
      if (!role) {
        throw new Error("Role không tồn tại");
      }

      res.render("roles/edit", { id, role, msg, isPermission, req, roles });
    } catch (e) {
      return next(e);
    }
  },
  handleEdit: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const permissions = !Array.isArray(body.permissions)
      ? [body.permissions]
      : body.permissions;
    const schema = object({
      name: string()
        .required("Vui lòng nhập tên role")
        .test("unique", "Role đã tồn tại ", async (value) => {
          const role = await Role.findOne({
            where: {
              name: value,
              id: {
                [Op.ne]: id,
              },
            },
          });
          return role ? false : true;
        }),
    });
    try {
      const body = await schema.validate(req.body, { abortEarly: false });
      const status = await Role.update(
        {
          name: body.name,
        },
        {
          where: { id },
        }
      );

      if (status && permissions.length) {
        const permissionsRequest = await Promise.all(
          permissions.map(async (permissionValue) => {
            const [permission] = await Permission.findOrCreate({
              where: {
                value: permissionValue.trim(),
              },
              defaults: {
                value: permissionValue.trim(),
              },
            });

            return permission;
          })
        );
        const role = await Role.findByPk(id);
        await role?.setPermissions(permissionsRequest);
        req.flash("msg", "Sửa role thành công");
      }
    } catch (error) {
      const errors = Object.fromEntries(
        error?.inner.map((item) => [item.path, item.message])
      );
      req.flash("errors", errors);
      req.flash("old", req.body);
    }
    return res.redirect("/roles/edit/" + id);
  },
  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const role = await Role.findByPk(id, {
        include: ["permissions", "users"],
      });

      if (role) {
        role.removePermissions(role.permissions);
        role.removeUsers(role.users);

        await role.destroy();

        req.flash("msg", "Xóa role thành công");
      }

      return res.redirect("/roles");
    } catch (e) {
      next(e);
    }
  },
};
