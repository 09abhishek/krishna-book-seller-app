const Sequelize = require("sequelize");
const db = require("../config/db.config");

const User = db.define("User", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  last_name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  user_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;
