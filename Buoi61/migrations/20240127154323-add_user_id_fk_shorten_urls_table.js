"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("shorten_urls", {
      fields: ["user_id"],
      type: "foreign key",
      name: "shorten_urls_user_id_foreign",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "shorten_urls",
      "shorten_urls_user_id_foreign"
    );
  },
};
