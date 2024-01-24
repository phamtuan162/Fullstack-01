"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.User, {
        through: "users_permissions",
        foreignKey: "permission_id",
        as: "users",
      });
      Permission.belongsToMany(models.Role, {
        through: "roles_permissions",
        foreignKey: "permission_id",
        as: "roles",
      });
    }
  }
  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      value: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Permission;
};
