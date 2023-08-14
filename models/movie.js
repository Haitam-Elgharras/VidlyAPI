const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genres.js");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

async function validMovie(data) {
  const schema = Joi.object({
    title: Joi.string().min(4).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });
  return schema.validate(data);
}
async function validId(req) {
  let movie = await Movie.findOne({ _id: req.params.id });
  return movie;
}

exports.Movie = Movie;
exports.validMovie = validMovie;
exports.validId = validId;
