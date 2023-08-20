const mongoose = require("mongoose");
const logger = require("../utils/logger");
const config = require("config");

// try to learn about transactions in mongodb and other databases
// const Fawn = require("fawn");
//Fawn.init(mongoose);
module.exports = function () {
  const db = config.get("db");

  mongoose.connect(db).then(() => logger.info(`Connected to ${db}...`));
};
