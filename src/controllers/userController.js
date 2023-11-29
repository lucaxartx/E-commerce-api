const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const customErr = require("../errors");
const { checkPersmission } = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users, count: users.length });
};
const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new customErr.notFoundError(`no user with id:${userId}`);
  }
  checkPersmission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
const updateUser = (req, res) => {
  res.send("get all users");
};
const updateUserPassword = (req, res) => {
  res.send("get all users");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
