const Sequelize = require("sequelize");
const db = require("../config/db.config");

const Publication = db.define("publication", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  year: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Publication;
