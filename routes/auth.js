const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const router = express.Router();
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

const passwordComplexityOptions = {
  min: 6,
  max: 255,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

// Create a user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  // Compare the password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // the key is for the digital signature
  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: passwordComplexity(passwordComplexityOptions).required(),
  });
  return schema.validate(req);
}

module.exports = router;
