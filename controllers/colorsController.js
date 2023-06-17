import expressAsyncHandler from "express-async-handler";

import Color from "../model/colorModel.js";

// @desc    Create Color
// @route   POST /api/v1/colors
// @access  Private
export const createColor = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  // Color exists
  const colorExists = await Color.findOne({ name });
  if (colorExists) {
    throw new Error("Color already exists!");
  }

  // Create Color
  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.status(201).json({
    status: "success",
    message: "Color created successfully!",
    color,
  });
});

// @desc    Update Color
// @route   PUT /api/v1/colors/:id
// @access  Private
export const updateColor = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name,
      user: req.userAuthId,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Color updated successfully!",
    color,
  });
});

// @desc    Delete Color
// @route   DELETE /api/v1/colors/:id
// @access  Private
export const deleteColor = expressAsyncHandler(async (req, res) => {
  await Color.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Color deleted successfully!",
  });
});

// @desc    Get Color
// @route   GET /api/v1/colors/:id
// @access  Public
export const getColor = expressAsyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Color fetched successfully!",
    color,
  });
});

// @desc    Get All Colors
// @route   GET /api/v1/colors
// @access  Public
export const getAllColors = expressAsyncHandler(async (req, res) => {
  const colors = await Color.find();

  res.status(200).json({
    status: "success",
    message: "Colors fetched successfully!",
    colors,
  });
});
