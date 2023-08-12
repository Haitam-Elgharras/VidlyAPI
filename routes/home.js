const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("WELCOME TO MY EXPRESS APP FOR MOVIES API");
});

module.exports = router;
