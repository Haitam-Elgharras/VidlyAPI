//this logger is work only for errors in express process pipeline
const { createLogger, format, transports } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logfile.log", // specify the path to your log file here
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.MongoDB({
      db: "mongodb://127.0.0.1:27017/vidly",
      level: "info",
      options: { useUnifiedTopology: true },
      collection: "log",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = logger;
