"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("users_roles", {
      fields: ["role_id"],
      type: "foreign key",
      name: "users_roles_role_id_foreign",
      references: {
        table: "roles",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "users_roles",
      "users_roles_role_id_foreign"
    );
  },
};
