const customError = require("../errors");

const checkPersmission = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new customError.unauthorizedError("unauthorized access ");
};
module.exports = checkPersmission;
