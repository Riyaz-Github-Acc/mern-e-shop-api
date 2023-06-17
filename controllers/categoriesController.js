import expressAsyncHandler from "express-async-handler";

import Category from "../model/categoryModel.js";

// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  // Category exists
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    throw new Error("Category already exists!");
  }

  // Create category
  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path,
  });

  res.status(201).json({
    status: "success",
    message: "Category created successfully!",
    category,
  });
});

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private
export const updateCategory = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      user: req.userAuthId,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Category updated successfully!",
    category,
  });
});

// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
export const deleteCategory = expressAsyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Category deleted successfully!",
  });
});

// @desc    Get Category
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategory = expressAsyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Category fetched successfully!",
    category,
  });
});

// @desc    Get All Categories
// @route   GET /api/v1/categories
// @access  Public
export const getAllCategories = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).json({
    status: "success",
    message: "Categories fetched successfully!",
    categories,
  });
});
