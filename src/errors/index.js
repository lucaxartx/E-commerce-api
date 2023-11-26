const customAPIError = require("./customApi");
const badRequestError = require("./badRequest");
const unauthenticatedError = require("./unauthenticated");
const notFoundError = require("./notFound");
const unauthorizedError = require("./unauthorized");

module.exports = {
  customAPIError,
  badRequestError,
  unauthenticatedError,
  unauthorizedError,
  badRequestError,
  notFoundError,
};

