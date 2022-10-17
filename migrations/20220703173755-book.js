module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("book", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      class: {
        type: Sequelize.ENUM,
        values: [
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
      year: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: false,
      },
      publication_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "publication",
          key: "id",
        },
      },
      price: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable("book");
  },
};
