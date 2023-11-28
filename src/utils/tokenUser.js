const createTokenUser = (user) => {
  return { name: User.name, role: user.role, userId: user._id };
};
module.exports = createTokenUser