import expressAsyncHandler from "express-async-handler";

import Brand from "../model/brandModel.js";
import Product from "../model/productModel.js";
import Category from "../model/categoryModel.js";

// @desc    Create Product
// @route   POST /api/v1/products
// @access  Private
export const createProduct = expressAsyncHandler(async (req, res) => {
  const { name, desc, brand, category, sizes, colors, price, totalQty } =
    req.body;

  // If product exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product already exists!");
  }

  // Check if category already exists
  const categoryFound = await Category.findOne({ name: category });
  if (!categoryFound) {
    throw new Error(
      "Category not found! Please create a new category or check the category name!"
    );
  }

  // Check if brand already exists
  const brandFound = await Brand.findOne({ name: brand });
  if (!brandFound) {
    throw new Error(
      "Brand not found! Please create a new brand or check the brand name!"
    );
  }

  // Image upload
  const imageUrl = await req.files.map((file) => file.path);

  // Create new product
  const product = await Product.create({
    name,
    desc,
    brand,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    images: imageUrl,
  });

  // Push product to the category
  categoryFound.products.push(product._id);
  // Category resave
  await categoryFound.save();

  // Push product to the brand
  brandFound.products.push(product._id);
  // Brand resave
  await brandFound.save();

  // Response
  res.status(201).json({
    success: true,
    message: "Product created successfully!",
    product,
  });
});

// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = expressAsyncHandler(async (req, res) => {
  const { name, desc, brand, category, sizes, colors, user, price, totalQty } =
    req.body;

  // Update product
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      desc,
      brand,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully!",
    product,
  });
});

// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = expressAsyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new Error("Product not found!");
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully!",
  });
});

// @desc    Get Product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "userName",
    },
  });

  if (!product) {
    throw new Error("Product not found!");
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully!",
    product,
  });
});

// @desc    Get All Products
// @route   GET /api/v1/products
// @access  Public
export const getAllProducts = expressAsyncHandler(async (req, res) => {
  let productQuery = Product.find().sort({ createdAt: -1 });

  // Filter by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  // Filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  // Filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  // Filter by color
  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }

  // Filter by size
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }

  // Filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  // Search by name, category, or brand
  const searchQuery = req.query.search;
  if (searchQuery) {
    productQuery = productQuery.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
      ],
    });
  }

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
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

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

  // Await the productQuery
  const products = await productQuery;

  res.status(200).json({
    status: "success",
    message: "Products fetched successfully!",
    total,
    results: products.length,
    pagination,
    products,
  });
});
