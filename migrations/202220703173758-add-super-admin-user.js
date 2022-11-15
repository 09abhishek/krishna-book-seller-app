module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("user", [
      {
        username: "admin",
        password: "$2b$10$H8.PIGOCdtEsbHM9X18a2eBtJd.k8Cy4a1oY9DnNMKiY4cMJeIAMu",
        first_name: "Super",
        last_name: "Admin",
        user_type: "super_admin",
        mobile_num: "8946032445",
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
