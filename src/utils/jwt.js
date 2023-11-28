//please install jsonwebtoken

const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token; //why do we return
};

const verifyToken = (token) => {
  jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookieToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24; //oneday
  res.cookie("token", token, {
    httpOnly: true, //only accessible on a browser
    expires: new Date(Date.now() + oneDay),
    secure: (process.env.NODE_ENV = "production"), //read up
    signed: true,
  });
};

module.exports = { attachCookieToResponse, createJWT, verifyToken };
