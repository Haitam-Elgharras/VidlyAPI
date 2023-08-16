const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre, validGenre, validId } = require("../models/genres");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  let genres = await Genre.find().sort("name");
  if (genres) {
    return res.send(genres);
  }
  return res.status(404).send("not found");
});

router.get("/:id", async (req, res) => {
  const genre = await validId(req);
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
  return res.send(newGenre);
});

router.put("/:id", async (req, res) => {
  const result = validGenre(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  let genre = await validId(req);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  genre.name = req.body.name;

  try {
    const genreResult = await genre.save();
    return res.send(genreResult);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// id must be like 64aad3f55e49eb026f121616
router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid ID");

  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  return res.send(genre);
});

module.exports = router;
