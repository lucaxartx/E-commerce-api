const User = require("../models/User");

const customError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { attachCookieToResponse, createTokenUser } = require("../utils");

const register = async () => {
  const { name, password, email } = req.body;
  const mailAlreadyExists = User.findOne(email);
  if (mailAlreadyExists) {
    throw new customError.badRequestError("email already in use ");
  }

  //check if its first user
  /** 
   * my idea 
   * try using user.countDocument,user.role,(might not work since we need entire schema to create user )
   * by putting this under User.create
   *
   * const isFirstAccount = await User.countDocuments;
  if (isFirstAccount == 0) {
    role == "admin";
  } else {
    role == "user";
  }
*/

  //check if account is first
  const isFirstAccount = (await User.countDocuments({})) == 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create(name, password, email, role);
  //attach cookie to response
  const tokenUser = createTokenUser(user);
  attachCookieToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async () => {};
const logout = async () => {
  res.send("register");
};

module.exports = { register, login, logout };
