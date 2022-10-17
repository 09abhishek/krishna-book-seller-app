// const mongoose = require('mongoose');
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const db = require("./config/db.config");
// To use mongoose in the code.

// mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
//   logger.info('Connected to MongoDB');
//   server = app.listen(config.port, () => {
//     logger.info(`Listening to port ${config.port}`);
//   });
// });

db.authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((error) => {
    logger.error("Unable to connect to the database: ", error);
  });

const server = app.listen(config.port, () => {
  logger.info(`To check the env variables check config.js file`);
  logger.info(`Listening to port 127.0.0.1:${config.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
