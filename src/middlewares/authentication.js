const { verifyToken } = require("../utils");
const customError = require("../errors");
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  // console.log(token);
  if (!token) {
    throw new customError.unauthenticatedError(
      "invalid Authentication: no token found "
    );
  }

  try {
    const { name, userId, role } = verifyToken({ token });
    // console.log("name of user:", { name });
    // console.log(verifyToken({ token }));
    // const payload = verifyToken({ token });
    // req.user = {
    //   name: payload.name,
    //   userId: payload.userId,
    //   role: payload.role,
    // };
    req.user = { name, userId, role };
    next();
  } catch (error) {
    // throw new customError.unauthenticatedError("authentication invalid");
    console.log(error);
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
