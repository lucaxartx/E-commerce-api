const customAPIError = require("./customApi");
const { StatusCodes } = require("http-status-codes");

class notFoundError extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = notFoundError;
