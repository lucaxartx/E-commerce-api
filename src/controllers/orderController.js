const Order = require("../models/Order");
const Product = require("../models/Product");
const { checkPermission } = require("../utils");

const customErr = require("../errors");
const { StatusCodes } = require("http-status-codes");
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingfee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new customErr.badRequestError("cart is empty ");
  }

  if (!tax || !shippingfee) {
    throw new customErr.badRequestError("no tax or shippiong fee provided ");
  }

  let orderItems = [];
  let subtotal = 0;

  //comfirm if each product in cart exists
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new customErr.notFoundError(`no product with id:${item.product}`);
    }
    const { name, price, image, _id } = dbProduct;
    const SingleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    orderItems = [...orderItems, SingleOrderItem];
    subtotal += item.amount * price;
    const total = tax + shippingfee + subtotal;
    const paymentIntent = await fakeStripeAPI({
      amount: total,
      currency: "usd",
    });
    const order = await Order.create({
      orderItems,
      total,
      subtotal,
      tax,
      shippingfee,
      client_secret: paymentIntent.client_secret,
      user: req.user.userId,
    });
    res.status(StatusCodes.CREATED).json({
      order,
      client_secret: order.client_secret,
    });
  }
};
const getAllOrders = async (req, res) => {
  const order = await Order.find({});
  res.status(StatusCodes.OK).json({ order, count: order.length });
};
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new customErr.notFoundError(`no order with id:${orderId}`);
  }

  checkPermission(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  const orders = await findOne({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders });
};

const updateOrder = async (req, res) => {
  const {
    params: { id: orderId },
    body: { paymentIntentId },
  } = req;
  const order = await findOne({ _id: orderId });
  if (!order) {
    throw new customErr.notFoundError(`no order with id:${orderId}`);
  }
  checkPermission(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  order.save();
  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
