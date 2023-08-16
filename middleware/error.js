module.exports = function (err, req, res, next) {
  //log the ex
  res.status(500).send("Something failed.");
};
