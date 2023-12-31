import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add product name"],
    },

    desc: {
      type: String,
      required: [true, "Please add product description"],
    },

    brand: {
      type: String,
      required: [true, "Please add product brand"],
    },

    category: {
      type: String,
      ref: "Category",
      required: [true, "Please add product category"],
    },

    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      required: [true, "Please add product size"],
    },

    colors: {
      type: [String],
      required: [true, "Please add product color"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    images: [
      {
        type: String,
        required: [true, "Please add product image"],
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    price: {
      type: Number,
      required: [true, "Please add product price"],
    },

    totalQty: {
      type: Number,
      required: [true, "Please add product total quantity"],
    },

    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtuals
// Qty left
ProductSchema.virtual("qtyLeft").get(function () {
  const product = this;
  return product?.totalQty - product?.totalSold;
});

// Total reviews
ProductSchema.virtual("totalReviews").get(function () {
  const product = this;
  return product?.reviews?.length;
});

// Total ratings
ProductSchema.virtual("totalReviews").get(function () {
  const product = this;
  return product?.reviews?.length;
});

//Average rating
ProductSchema.virtual("averageRating").get(function () {
  let ratingsTotal = 0;
  const product = this;
  product?.reviews?.forEach((review) => {
    ratingsTotal += review?.rating;
  });

  //Calc average rating
  const averageRating = Number(ratingsTotal / product?.reviews?.length).toFixed(
    1
  );

  return averageRating;
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
