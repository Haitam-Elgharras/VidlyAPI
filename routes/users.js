const express = require("express");
const mongoose = require("mongoose");
const { validateUser, User } = require("../models/user");
const router = express.Router();

// Create a user
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  await user.save();
  res.send(user);
});

module.exports = router;
