"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("billing", {
      id: {
        type: Sequelize.INTEGER(6).ZEROFILL,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unsigned: true,
      },
      invoice_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      class: {
        type: Sequelize.ENUM,
        values: [
          "pre-nursery",
          "infant",
          "nursery",
          "prep",
          "one",
          "two",
          "three",
          "four",
          "five",
          "six",
          "seven",
          "eight",
          "nine",
          "ten",
          "eleven",
          "twelve",
        ],
      },
      father_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobile_num: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bill_data: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
      },
      total_net_amount: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
      },
      year: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("billing");
  },
};
