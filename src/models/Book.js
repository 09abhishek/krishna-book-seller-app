const Sequelize = require("sequelize");
const db = require("../config/db.config");

const Token = db.define("book", {
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
      "pre-nursery",
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
      model: "Publication",
      key: "id",
    },
  },
  mrp: {
    type: Sequelize.DECIMAL(6, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  net_price: {
    type: Sequelize.DECIMAL(6, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  quantity: {
    type: Sequelize.INTEGER(3),
    allowNull: false,
    defaultValue: 0,
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
