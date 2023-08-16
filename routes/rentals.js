const { Rental, validate, validId } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// To use fawn
// change obj.modelScemas to obj.Schema in isMongoose(obj) function.(not recommended)
Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  // those two lines are dependant on each other. here we need to use transactions

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
  } catch (ex) {
    res.status(500).send("Something failed.");
  }

  res.send(rental);
});

// An implementation of the Post method using transactions
/*
with this I get an error indicate that 
To use transactions, you need to have a replica set or a sharded cluster set up. A replica set is a group of MongoDB
 servers that maintain the same data set, providing redundancy and high availability. A sharded cluster is a 
 distributed system where data is distributed across multiple servers.

*/
/*router.post("/", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { error } = validate(req.body);
  if (error) {
    session.endSession();
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findById(req.body.customerId).session(
    session
  );
  if (!customer) {
    session.endSession();
    return res.status(400).send("Invalid customer.");
  }

  const movie = await Movie.findById(req.body.movieId).session(session);
  if (!movie) {
    session.endSession();
    return res.status(400).send("Invalid movie.");
  }

  if (movie.numberInStock === 0) {
    session.endSession();
    return res.status(400).send("Movie not in stock.");
  }

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    await rental.save({ session });
    movie.numberInStock--;
    await movie.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.send(rental);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send("An error occurred while processing the transaction.");
  }
});*/

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid ID");

  const rental = validId(req);
  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid ID");

  const rental = validId(req);
  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  const result = await Rental.deleteOne(req.body.id);
  res.send(result);
});

module.exports = router;
