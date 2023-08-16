module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      // passed directly to the last middleware in the pipeline
      //which is the error middleware
      next(ex);
    }
  };
};
