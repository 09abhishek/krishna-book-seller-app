// eslint-disable-next-line import/no-extraneous-dependencies
const { Service } = require("node-windows");

// Create a new service object
const svc = new Service({
  name: "Krishna Book Seller App Server",
  description: "Krishna Book Seller Application Service",
  script: "C:\\krishna-book-seller-app\\run.js",
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  svc.start();
});

svc.install();
