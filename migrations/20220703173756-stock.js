'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("stock", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      book_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "book",
          key: "id",
        },
      },
      total_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      year: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("stock");
  }
};
