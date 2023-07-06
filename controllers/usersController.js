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
// @access  Public
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

// @desc    Update User
// @route   PUT /api/v1/users/update/:id
// @access  Public
export const updateUser = expressAsyncHandler(async (req, res) => {
  const { userName, email, image } = req.body;
  const userId = req?.params?.id;

  // Find the user
  const user = await User.findById(req.userAuthId);

  // Check the user is exist
  if (!user) {
    throw new Error("User not found!");
  }

  // If the user is there or the user is admin update details
  if (user.isAdmin || req.userAuthId === userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        userName,
        email,
        // image: req.file.path,
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "User updated successfully!",
      user,
    });
  } else {
    throw new Error(
      "You are not authorized to update! Only the owner of the profile or admin is allowed to update!"
    );
  }
});

// @desc    Delete User
// @route   DELETE /api/v1/users/delete/:id
// @access  Public
export const deleteUser = expressAsyncHandler(async (req, res) => {
  const userId = req?.params?.id;

  // Find the user
  const user = await User.findById(req.userAuthId);

  // Check the user is exist
  if (!user) {
    throw new Error("User not found!");
  }

  // If the user is there or the user is admin delete details
  if (user.isAdmin || req.userAuthId === userId) {
    await User.findByIdAndDelete(userId);
  } else {
    throw new Error(
      res.status(403).json({
        status: "fail",
        message:
          "You are not authorized to delete! Only the owner of the profile or admin is allowed to delete!",
      })
    );
  }

  res.status(200).json({
    status: "success",
    message: "User deleted successfully!",
  });
});

// @desc    Get All Users
// @route   GET /api/v1/users
// @access  Private
export const getAllUsers = expressAsyncHandler(async (req, res) => {
  let userQuery = User.find();

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
  const total = await User.countDocuments();

  userQuery = userQuery.skip(startIndex).limit(limit);

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

  // Await the user
  const users = await userQuery;

  res.status(200).json({
    status: "success",
    message: "users fetched successfully!",
    total,
    results: users.length,
    pagination,
    users,
  });
});
