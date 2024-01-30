"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Provider, {
        foreignKey: "provider_id",
        as: "providers",
      });
      User.belongsToMany(models.Role, {
        through: "users_roles",
        foreignKey: "user_id",
        as: "roles",
      });
      User.belongsToMany(models.Permission, {
        through: "users_permissions",
        foreignKey: "user_id",
        as: "permissions",
      });
      User.hasMany(models.ShortenUrl, {
        foreignKey: "user_id",
        as: "shorten_urls",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      provider_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
};
