const { StatusCodes } = require("http-status-codes");

class ValidationError extends Error {
  constructor(error) {
    super();
    let explanation = [];
    error.errors.forEach((err) => {
      explanation.push(err.message);
    });
    (this.name = "Validation error"),
      (this.message = "Not able to Validate The Data"),
      (this.description = description),
      (this.statusCode = StatusCodes.BAD_REQUEST);
  }
}

module.exports = ValidationError;
