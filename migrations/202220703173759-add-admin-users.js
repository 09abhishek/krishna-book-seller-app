module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("user", [
      {
        username: "rajesh",
        password: "$2b$10$kK8.YTIJlY6fZDyz5/0gUeRF3RJnrgfuXHnL4l/U44z839eWBnkrq",
        first_name: "Rajesh",
        last_name: "Sir",
        user_type: "admin",
        mobile_num: "",
      },
      {
        username: "rishov",
        password: "$2b$10$kK8.YTIJlY6fZDyz5/0gUeRF3RJnrgfuXHnL4l/U44z839eWBnkrq",
        first_name: "Rishov",
        last_name: "Sir",
        user_type: "super_admin",
        mobile_num: "",
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
