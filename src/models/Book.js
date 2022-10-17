const Sequelize = require("sequelize");
const db = require("../config/db.config");

const Token = db.define("Book", {
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
    allowNull: true,
  },
  updated_at: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

module.exports = Token;
