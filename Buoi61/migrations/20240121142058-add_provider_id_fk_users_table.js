"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("users", {
      fields: ["provider_id"],
      type: "foreign key",
      name: "user_provider_id_foreign",
      references: {
        table: "providers",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("users", "user_provider_id_foreign");
  },
};
