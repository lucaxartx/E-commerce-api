const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

const {
  authenticateUser,
  authorizeRole,
} = require("../middlewares/authentication");

router
  .route("/")
  .post([authenticateUser, authorizeRole("admin")], createProduct)
  .get(authenticateUser, getAllProducts);

router.route("/uploadImage").post(uploadImage);

router
  .route("/:id")
  .get(authenticateUser, getSingleProduct)
  .patch([authenticateUser, authorizeRole("admin")], updateProduct)
  .delete([authenticateUser, authorizeRole("admin")], deleteProduct);

module.exports = router;
