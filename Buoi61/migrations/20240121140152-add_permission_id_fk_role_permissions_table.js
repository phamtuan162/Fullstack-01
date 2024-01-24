"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("roles_permissions", {
      fields: ["permission_id"],
      type: "foreign key",
      name: "role_permission_permission_id_foreign",
      references: {
        table: "permissions",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "roles_permissions",
      "role_permission_permission_id_foreign"
    );
  },
};
