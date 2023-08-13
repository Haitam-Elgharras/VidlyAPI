const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");

// try to learn about transactions in mongodb and other databases
// const Fawn = require("fawn");
//Fawn.init(mongoose);

const genres = require("./routes/genres");
const home = require("./routes/home");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");

app.use("/", home);
app.use("/vidly/api/genres", genres);
app.use("/vidly/api/customers", customers);
app.use("/vidly/api/movies", movies);
app.use("/vidly/api/rentals", rentals);

mongoose
  .connect("mongodb://127.0.0.1:27017/vidly")
  .then(() => console.log("connected to mongoodb"))
  .catch((err) => console.log(err.message[0]));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log("listen to port 3000..."));