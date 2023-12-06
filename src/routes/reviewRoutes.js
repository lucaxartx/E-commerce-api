const express = require("express");
const router = express.Router();

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const {
  authenticateUser,
  authorizeRole,
} = require("../middlewares/authentication");

router
  .route("/")
  .post([authenticateUser, authorizeRole("user")], createReview)
  .get(getAllReviews);

router
  .route("/:id")
  .get(getSingleReview)
  .patch([authenticateUser, authorizeRole("user")], updateReview)
  .delete([authenticateUser, authorizeRole("user")], deleteReview);

module.exports = router;
