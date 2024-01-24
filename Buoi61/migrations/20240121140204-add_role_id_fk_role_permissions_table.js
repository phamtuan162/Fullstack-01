"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("roles_permissions", {
      fields: ["role_id"],
      type: "foreign key",
      name: "role_permission_role_id_foreign",
      references: {
        table: "roles",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "roles_permissions",
      "role_permission_role_id_foreign"
    );
  },
};
