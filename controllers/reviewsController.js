import expressAsyncHandler from "express-async-handler";

import Review from "../model/reviewModel.js";
import Product from "../model/productModel.js";

// @desc    Create Review
// @route   POST /api/v1/reviews/:productID
// @access  Private
export const createReview = expressAsyncHandler(async (req, res) => {
  const { comment, rating } = req.body;

  // Find the product
  const { productID } = req.params;
  const productFound = await Product.findById(productID);
  if (!productFound) {
    throw new Error("Product not found!");
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    product: productFound._id,
    user: req.userAuthId,
  });
  if (existingReview) {
    throw new Error("You have already reviewed this product!");
  }

  // Create review
  const review = await Review.create({
    comment,
    rating,
    product: productID,
    user: req.userAuthId,
  });

  // Push review into the product
  productFound.reviews.push(review._id);
  // Product resave
  await productFound.save();

  res.status(201).json({
    status: "success",
    message: "Review created successfully!",
    review,
  });
});
