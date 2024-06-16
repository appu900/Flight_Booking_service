const { StatusCodes } = require("http-status-codes");

class ServiceError extends Error {
  constructor(
    message = "Somethig Went Wrong",
    description = "service layer error",
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.message = message;
    this.description = description;
    this.statusCode = statusCode;
  }
}

module.exports = ServiceError;
