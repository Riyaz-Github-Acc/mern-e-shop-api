import bcrypt from "bcrypt";
import expressAsyncHandler from "express-async-handler";

import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Private
export const register = expressAsyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    // Throw an error
    throw new Error("User already exists!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await User.create({
    userName,
    email,
    password: hashedPassword,
    image: req.file.path,
  });

  res.status(201).json({
    status: "success",
    message: "User registered successfully!",
    user,
  });
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      status: "success",
      message: "User logged in successfully!",
      user,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Invalid login credentials!");
  }
});
