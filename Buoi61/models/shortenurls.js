"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShortenUrl extends Model {
    static associate(models) {
      ShortenUrl.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "users",
      });
    }
  }
  ShortenUrl.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      short_url: DataTypes.STRING,
      full_url: DataTypes.STRING,
      password: DataTypes.STRING,
      clicks: DataTypes.INTEGER,
      safe: DataTypes.BOOLEAN,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ShortenUrl",
      tableName: "shorten_urls",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return ShortenUrl;
};
