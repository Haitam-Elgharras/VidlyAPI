const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const Joi = require("joi");
const validate = require("../middleware/validate");

const validateReturn = (req) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
};

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed");

  rental.return();

  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  // the 200 status is the default
  return res.send(rental);
});

module.exports = router;

// Post /vidly/api/returns {customerId,movieId}

//return 401 if client is not logged in
//return 400 if customerId is not provided
//return 400 if movieId is not provided
// return 400 if the id is not a valid object id
// return 404 if no rental found for this customer/movie
// return 400 if rental already processed
// return 200 if valid request
// set the return date
// calculate the rental fee
// increase the stock
// return the rental
