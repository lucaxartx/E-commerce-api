const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name "],
    trim: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "please provide email "],
    validate: { validator: validator.isEmail },
  },
  password: {
    type: String,
    required: [true, "please provide password  "],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: [true, "please provide role"],
  },
});

//hash password
userSchema.pre("save", async function () {
  console.log(this.modifiedPaths()); //see what was updated in a patch or put
  if (!this.isModified("password")) return; //check if password is changed during a patch or put
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", userSchema);
