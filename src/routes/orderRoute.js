const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeRole,
} = require("../middlewares/authentication");

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");

router
  .route("/")
  .get([authenticateUser, authorizeRole("admin")], getAllOrders)
  .post(authenticateUser, createOrder);
router.route("/showAllMyOrders").get(getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

module.exports = router;
