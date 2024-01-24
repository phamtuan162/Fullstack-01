"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("users_permissions", {
      fields: ["user_id"],
      type: "foreign key",
      name: "users_permission_user_id_foreign",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "users_permissions",
      "users_permission_user_id_foreign"
    );
  },
};
