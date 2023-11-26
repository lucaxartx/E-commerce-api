const customAPIError = require("./customApi");
const { StatusCodes } = require("http-status-codes");

class badRequestError extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = badRequestError;
