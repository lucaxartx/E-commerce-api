const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const customErr = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, productamount: products.length });
};
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new customErr.notFoundError(
      `no product with id:${req.params.productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.productId },
    req.body
  );
  if (!product) {
    throw new customErr.notFoundError(
      `no product with id:${req.params.productId}`
    );
  }

  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.productId });
  if (!product) {
    throw new customErr.notFoundError(
      `no product with id:${req.params.productId}`
    );
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "product deleted successfully " });
};
const uploadImage = async (req, res) => {
  console.log(req.files);
  if (!req.files) {
    throw new customErr.notFoundError("no file uploaded ");
  }

  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new customErr.notFoundError("no image found ");
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new customErr.badRequestError("image size must be less than 1mb ");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads" + `${productImage.name}`
  );

  await productImage.mv(imagePath);
  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
