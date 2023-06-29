import expressAsyncHandler from "express-async-handler";

import User from "../model/userModel.js";
import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";

import paymentSession from "../utils/payment.js";

// @desc    Create Order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = expressAsyncHandler(async (req, res) => {
  // Find the user
  const user = await User.findById(req.userAuthId);

  // Get the payload
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // Check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide a shipping address!");
  }

  // Check if the order is not empty
  if (orderItems.length <= 0) {
    throw new Error("No order item found!");
  }

  // Place/Create order and save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice,
  });

  // Update the product qty and sold
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });

    if (product) {
      product.totalSold += order.qty;
    }

    await product.save();
  });

  // Push order into user
  user?.orders.push(order._id);
  await user.save();

  // Make payment (Stripe)
  const sessionURL = await paymentSession(orderItems, order);
  res.send({ url: sessionURL });
});

// @desc    Update Order
// @route   PUT /api/v1/orders/update/:id
// @access  Private
export const updateOrder = expressAsyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Order updated successfully!",
    updateOrder,
  });
});

// @desc    Get Order
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrder = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Order fetched successfully",
    order,
  });
});

// @desc    Get All Orders
// @route   GET /api/v1/orders
// @access  Private
export const getAllOrders = expressAsyncHandler(async (req, res) => {
  let orderQuery = Order.find();

  // Pagination
  // Page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // Limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // Start Index
  const startIndex = (page - 1) * limit;
  // End Index
  const endIndex = page * limit;
  // Total
  const total = await Order.countDocuments();

  orderQuery = orderQuery.skip(startIndex).limit(limit);

  // Pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // Await the order
  const orders = await orderQuery;

  res.status(200).json({
    status: "success",
    message: "Orders fetched successfully!",
    total,
    results: orders.length,
    pagination,
    orders,
  });
});
