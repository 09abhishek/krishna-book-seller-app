const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const billRoute = require("./billing.route");
const docsRoute = require("./docs.route");
const bookRoute = require("./book.route");
const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/billing",
    route: billRoute,
  },
  {
    path: "/book",
    route: bookRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
