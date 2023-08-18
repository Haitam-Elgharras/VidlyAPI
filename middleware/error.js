const logger = require("../utils/logger");

//only exception that are not handled in the request processing pipeline(express)
module.exports = function (err, req, res, next) {
  logger.error(err.message, err);
  // return the error
  res.status(500).send("Something failed.");
};
