const User = require("../models/User");

const customError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { attachCookieToResponse, createTokenUser } = require("../utils");
const { compare } = require("bcryptjs");

const register = async (req, res) => {
  const { name, password, email } = req.body;
  const mailAlreadyExists = await User.findOne({ email });
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

  User.watch().on("change", (data) => console.log(data));

  const user = await User.create({ name, password, email, role });
  //attach cookie to response
  const tokenUser = createTokenUser(user);
  attachCookieToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { password, email } = req.body;
  if (!email || !password) {
    throw new customError.badRequestError("please provide email and password ");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new customError.notFoundError("user not found");
  }

  const isPasswordCorrect = await User.comparepassword(password);
  if (!isPasswordCorrect) {
    throw new customError.unauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  attachCookieToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out successfully " });
};

module.exports = { register, login, logout };
