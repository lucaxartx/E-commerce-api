const customAPIError = require("./customApi");
const { StatusCodes } = require("http-status-codes");

class unauthorizedError extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = unauthorizedError;
