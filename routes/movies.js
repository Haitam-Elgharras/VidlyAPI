const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Movie, validMovie, validId } = require("../models/movie");
const { Genre } = require("../models/genres");

router.get("/", async (req, res) => {
  let movies = await Movie.find().sort("name");
  if (movies) {
    return res.send(movies);
  }
  return res.status(404).send("not found");
});

router.get("/:id", async (req, res) => {
  const movie = await validId(req);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validMovie(req.body);
  if (error) return res.status(400).send(result.error.details[0].message);

  if (!mongoose.Types.ObjectId.isValid(req.body.genreId))
    return res.status(400).send("Invalid objectId for genre");

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  let newMovie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  try {
    newMovie = await newMovie.save();
    return res.send(newMovie);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.put("/:id", async (req, res) => {
  const result = validMovie(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  let movie = await validId(req);
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  for (const key in req.body) {
    if (movie[key] !== undefined) {
      movie[key] = req.body[key];
    }
  }

  try {
    const newMovie = await movie.save();
    return res.send(newMovie);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// id must be like 64aad3f55e49eb026f121616
router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid ID");

  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");
  return res.send(movie);
});

module.exports = router;
