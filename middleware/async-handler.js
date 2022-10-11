// Asynchronous Handling middleware
exports.asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      // Passes error to global error handler
      next(err);
    }
  };
};
