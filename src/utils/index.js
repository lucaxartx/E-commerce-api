const { attachCookieToResponse, createJWT, verifyToken } = require("./jwt");
const createTokenUser = require("./tokenUser");
const checkPermission = require("./checkPermission");

module.exports = {
  attachCookieToResponse,
  createJWT,
  verifyToken,
  createTokenUser,
  checkPermission,
};
