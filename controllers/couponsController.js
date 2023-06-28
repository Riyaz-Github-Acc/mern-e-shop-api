import asyncHandler from "express-async-handler";

import Coupon from "../model/couponModel.js";

// @desc    Create New Coupon
// @route   POST /api/v1/coupons
// @access  Private
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  //Check if admin
  //Check if coupon already exists
  const couponsExists = await Coupon.findOne({
    code: { $regex: code, $options: "i" },
  });

  if (couponsExists) {
    throw new Error("Coupon already exists!");
  }

  //Check if discount is a number
  if (isNaN(discount)) {
    throw new Error("Discount value must be a number!");
  }

  //Create coupon
  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });

  res.status(201).json({
    status: "success",
    message: "Coupon created successfully!",
    coupon,
  });
});

// @desc    Update Coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private
export const updateCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    message: "Coupon updated successfully!",
    coupon,
  });
});

// @desc    Delete Coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Coupon deleted successfully!",
    coupon,
  });
});

// @desc    Get Coupon
// @route   GET /api/v1/coupons/:id
// @access  Private
export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.json({
    status: "success",
    message: "Coupon fetched successfully!",
    coupon,
  });
});

// @desc    Get All Coupons
// @route   GET /api/v1/coupons
// @access  Private
export const getAllCoupons = asyncHandler(async (req, res) => {
  let couponQuery = Coupon.find();

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
  const total = await Coupon.countDocuments();

  couponQuery = couponQuery.skip(startIndex).limit(limit);

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

  // Await the Coupon
  const coupons = await couponQuery;

  res.status(200).json({
    status: "success",
    message: "Coupons fetched successfully!",
    total,
    results: coupons.length,
    pagination,
    coupons,
  });
});
