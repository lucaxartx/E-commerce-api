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
    unique: true,
    required: [true, "please provide email "],
    validate: {
      validator: validator.isEmail,
      message: "please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "please provide password  "],
    minlenght: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

//hash password
userSchema.pre("save", async function () {
  console.log(this.modifiedPaths()); //see what was updated in a patch or put
  if (!this.isModified("password")) return; //check if password is changed during a patch or put
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  // console.log(enteredPassword);
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  // console.log(isMatch);
  return isMatch;
};
module.exports = mongoose.model("User", userSchema);
