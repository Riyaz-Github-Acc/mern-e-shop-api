import expressAsyncHandler from "express-async-handler";

import User from "../model/userModel.js";

// @desc    User Profile
// @route   GET /api/v1/users/profile
// @access  Public
export const profile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate("orders");
  res.status(200).json({
    status: "success",
    message: "User profile fetched successfully!",
    user,
  });
});

// @desc    Update User Shipping Address
// @route   PUT /api/v1/users/update/shipping
// @access  Private
export const updateShippingAddress = expressAsyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    state,
    country,
    phone,
  } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        state,
        country,
        phone,
      },
      hasShippingAddress: true,
    },
    { new: true }
  );

  res.json({
    status: "success",
    message: "User shipping address updated successfully!",
    user,
  });
});
