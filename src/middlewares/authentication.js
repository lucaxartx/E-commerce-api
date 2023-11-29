const { verifyToken } = require("../utils");
const customError = require("../errors");
const authenticateUser = async (req, res, next) => {
  const token = req.signedcookies.token;
  if (!token) {
    throw new customError.unauthenticatedError("invalid Authentication ");
  }
  try {
    const { name, userId, role } = verifyToken(token);
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new customError.unauthenticatedError("authentication invalid");
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new customError.unauthorizedError(
        "user not allowed to access route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
