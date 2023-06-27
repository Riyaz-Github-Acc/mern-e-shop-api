import expressAsyncHandler from "express-async-handler";

import Brand from "../model/brandModel.js";

// @desc    Create Brand
// @route   POST /api/v1/brands
// @access  Private
export const createBrand = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  // Brand exists
  const brandExists = await Brand.findOne({ name });
  if (brandExists) {
    throw new Error("Brand already exists!");
  }

  // Create brand
  const brand = await Brand.create({
    name: name.toLowerCase(),
    // name: name,
    user: req.userAuthId,
  });

  res.status(201).json({
    status: "success",
    message: "Brand created successfully!",
    brand,
  });
});

// @desc    Update Brand
// @route   PUT /api/v1/brands/:id
// @access  Private
export const updateBrand = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name,
      user: req.userAuthId,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Brand updated successfully!",
    brand,
  });
});

// @desc    Delete Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
export const deleteBrand = expressAsyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Brand deleted successfully!",
  });
});

// @desc    Get Brand
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrand = expressAsyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Brand fetched successfully!",
    brand,
  });
});

// @desc    Get All Brands
// @route   GET /api/v1/brands
// @access  Public
export const getAllBrands = expressAsyncHandler(async (req, res) => {
  const brands = await Brand.find();

  res.status(200).json({
    status: "success",
    message: "Brands fetched successfully!",
    brands,
  });
});
