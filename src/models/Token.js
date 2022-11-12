const Sequelize = require("sequelize");
const db = require("../config/db.config");

const Token = db.define("token", {
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
      model: "User",
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

module.exports = Token;
