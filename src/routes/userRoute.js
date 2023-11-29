const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeRole,
} = require("../middlewares/authentication");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

router.route("/").get([authenticateUser, authorizeRole("admin")], getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/update").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
