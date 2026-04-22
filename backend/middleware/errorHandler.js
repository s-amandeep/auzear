function errorHandler(err, req, res, next) {
  console.error("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    error: err.message || "Something went wrong",
  });
}

module.exports = errorHandler;