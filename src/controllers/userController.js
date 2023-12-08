const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const customErr = require("../errors");
const {
  checkPermission,
  createTokenUser,
  attachCookieToResponse,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

const getSingleUser = async (req, res) => {
  console.log(req.user);
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("-password");

  if (!user) {
    throw new customErr.notFoundError(`no user with id:${userId}`);
  }

  checkPermission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new customErr.notFoundError("please provide email and name ");
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );
  const tokenUser = createTokenUser(user);
  attachCookieToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

/**update user via findOne
 * const updateUser =  async ()=>{
 * 
 * const {email,name}=req.body 
 * if(!email||!name){
 * throw new customErr.notFoundError('please provide email and name ')
 * }
 * 
 * const user = await User.findOne(
    { _id: req.user.userId } //remember req.user created in middleware(authentication ) 
  );
  user.name = name
  user.email = email 

  await user.save()
  const tokenUser = createTokenUser(user);
  attachCookieToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
 * 
 * }
 */

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new customErr.badRequestError(
      "please provide oldpassword and newpassword "
    );
  }

  const user = await User.findOne({ _id: req.user.userId });

  //was ispasswordCorrrect same as login controller i prefer comfirmpassword
  const comfirmPassword = await user.comparePassword(oldPassword); //if oldpassword matches saved password(this.password/user.password)
  if (!comfirmPassword) {
    throw new customErr.unauthenticatedError("invalid credentials ");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "password updated successfully " });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
