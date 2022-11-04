const Sequelize = require("sequelize");
const db = require("../config/db.config");

const Billing = db.define("Billing", {
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
    type: Sequelize.DECIMAL(6, 2),
    allowNull: false,
  },
  year: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  created_at: {
    type: Sequelize.DATE,
  },
  updated_at: {
    type: Sequelize.DATE,
  },
});

module.exports = Billing;
