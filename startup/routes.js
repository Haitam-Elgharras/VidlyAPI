const express = require("express");
const genres = require("../routes/genres");
const home = require("../routes/home");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/", home);
  app.use("/vidly/api/genres", genres);
  app.use("/vidly/api/customers", customers);
  app.use("/vidly/api/movies", movies);
  app.use("/vidly/api/rentals", rentals);
  app.use("/vidly/api/users", users);
  app.use("/vidly/api/auth", auth);
  app.use("/vidly/api/returns", returns);
  // centralize error handling
  app.use(error);
};
