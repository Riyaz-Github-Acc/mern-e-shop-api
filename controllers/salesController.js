import expressAsyncHandler from "express-async-handler";

import Order from "../model/orderModel.js";

// @desc    Get Sales Report
// @route   GET /api/v1/sales
// @access  Private
export const getSalesReport = expressAsyncHandler(async (req, res) => {
  // Sales
  const sales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
        minSale: {
          $min: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
      },
    },
  ]);

  // Today sales
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const todaySales = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: today,
        },
      },
    },

    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    message: "Sales report fetched successfully!",
    sales,
    todaySales,
  });
});
