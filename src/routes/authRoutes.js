const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/authController");

router.route("/register").post(register);
router.route("/register").post(login);
router.route("/register").get(logout);

module.exports = router;
