const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { validateUser, User } = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");

// Create a user
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // auto login after registration
  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
