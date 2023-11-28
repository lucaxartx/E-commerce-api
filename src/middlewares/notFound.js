const { StatusCodes } = require("http-status-codes");

const notFound = (req, res, next) => {
  return res.status(StatusCodes.NOT_FOUND).send("Route does not exist");
};

module.exports = notFound;
