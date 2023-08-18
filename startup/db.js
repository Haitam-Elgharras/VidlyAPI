const mongoose = require("mongoose");
const logger = require("../utils/logger");

// try to learn about transactions in mongodb and other databases
// const Fawn = require("fawn");
//Fawn.init(mongoose);
module.exports = function () {
  //the error here will terminate the process
  mongoose
    .connect("mongodb://127.0.0.1:27017/vidly")
    .then(() => logger.info("Connected to MongoDB..."));
};
