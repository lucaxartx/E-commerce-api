const { StatusCodes } = require("http-status-codes");

const errorhandler = (err, req, res, next) => {
  let customError = {
    msg: err.message || "Something went wrong ",
    statuscode: err.statuscode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name == "ValidatiionError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statuscode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  console.log(err);

  return res.status(customError.statuscode).json({ msg: customError.msg });
};

module.exports = errorhandler;
