const mongoose = require("mongoose");
const validator = require("validator");

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

module.exports = mongoose.model("User", userSchema);
