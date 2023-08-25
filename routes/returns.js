const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/", (req, res) => {
  if (!req.body.customerId || !req.body.movieId)
    return res.status(400).send("Bad request");

  res.status(401).send("Unauthorized");
});

module.exports = router;
