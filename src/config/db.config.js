const { Sequelize } = require("sequelize");
const config = require("./config");

const db = config.mysql;

module.exports = new Sequelize({
  database: db.DATABASE,
  username: db.USERNAME,
  password: db.PASSWORD,
  host: db.HOST,
  port: Number(db.DB_PORT),
  dialect: "mysql",
  models: [],
  pool: { max: 10 },
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});
