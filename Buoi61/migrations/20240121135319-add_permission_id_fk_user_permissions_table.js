"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("users_permissions", {
      fields: ["permission_id"],
      type: "foreign key",
      name: "users_permission_permission_id_foreign",
      references: {
        table: "permissions",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "users_permissions",
      "users_permission_permission_id_foreign"
    );
  },
};
