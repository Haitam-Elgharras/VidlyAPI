module.exports = function (req, res, next) {
  // 401 Unauthorized : when the user supplies invalid jwt
  // 403 Forbidden: when the user supplies valid jwt but not allowed to perform the operation

  // req.user.isAdmin is set in the auth middleware
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");
  next();
};
