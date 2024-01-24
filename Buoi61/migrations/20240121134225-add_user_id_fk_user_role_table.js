"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("users_roles", {
      fields: ["user_id"],
      type: "foreign key",
      name: "users_roles_user_id_foreign",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "users_roles",
      "users_roles_user_id_foreign"
    );
  },
};
