module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("token", {
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["REFRESH", "RESET_PASSWORD", "VERIFY_EMAIL"],
      },
      expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      blacklisted: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("token");
  },
};
