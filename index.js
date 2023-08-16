// This is a replacement for asyncMiddleware function
//that wraps the route handler inside a try catch block
require("express-async-errors");
const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// try to learn about transactions in mongodb and other databases
// const Fawn = require("fawn");
//Fawn.init(mongoose);
const genres = require("./routes/genres");
const home = require("./routes/home");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

app.use(express.json());
app.use("/", home);
app.use("/vidly/api/genres", genres);
app.use("/vidly/api/customers", customers);
app.use("/vidly/api/movies", movies);
app.use("/vidly/api/rentals", rentals);
app.use("/vidly/api/users", users);
app.use("/vidly/api/auth", auth);
// centralize error handling
app.use(error);

mongoose
  .connect("mongodb://127.0.0.1:27017/vidly")
  .then(() => console.log("connected to mongoodb"))
  .catch((err) => console.log(err.message[0]));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log("listen to port 3000..."));
