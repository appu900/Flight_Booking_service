class AppError extends Error {
  constructor(errName, message, description, statusCode) {
    super();
    this.errName = errName;
    (this.message = message),
      (this.description = description),
      (this.statusCode = statusCode);
  }
}

module.exports = AppError;
