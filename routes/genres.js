const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre, validGenre, validId } = require("../models/genres");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validate");

router.get("/", async (req, res) => {
  let genres = await Genre.find().sort("name");
  if (genres) return res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findOne({ _id: req.params.id });

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let newGenre = new Genre({
    name: req.body.name,
  });

  newGenre = await newGenre.save();
  return res.status(201).send(newGenre);
});

router.put("/:id", [auth, validate(validGenre)], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid ID");

  let genre = await Genre.findOne({ _id: req.params.id });
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  genre.name = req.body.name;

  try {
    const genreResult = await genre.save();
    return res.status(200).send(genreResult);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// id must be like 64aad3f55e49eb026f121616
router.delete("/:id", [auth, admin], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid ID");

  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  return res.send(genre);
});

module.exports = router;
