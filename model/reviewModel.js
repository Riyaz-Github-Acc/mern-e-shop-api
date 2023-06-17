import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to the user!"],
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to the product!"],
    },

    comment: {
      type: String,
      required: [true, "Please add a comment"],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please add a rating between 1 to 5"],
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
