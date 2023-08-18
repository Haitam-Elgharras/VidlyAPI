// This is a replacement for asyncMiddleware function
//that wraps the route handler inside a try catch block
require("express-async-errors");
const logger = require("../utils/logger");

function loggin() {
  // this handler is for all sync exceptions in node process pipeline that are not handled.
  process.on("uncaughtException", (ex) => {
    logger.error(ex.message, ex);
    setTimeout(() => {
      process.exit(1);
    }, 500);
  });

  // this handler is for all async exceptions(unhandled promise rejections).
  process.on("unhandledRejection", (ex) => {
    logger.error(ex.message, ex);
    // solution needed to terminate the process without waiting for the timeout
    setTimeout(() => {
      process.exit(1);
    }, 500);
  });
}

module.exports = loggin;
