import bcrypt from "bcrypt";
import crypto from "crypto";
import expressAsyncHandler from "express-async-handler";

import User from "../model/userModel.js";
import sendEmail from "../utils/email.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
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
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Invalid login credentials!");
  }
});

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
export const forgotPassword = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Find the user using email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found!");
  }

  // Generate a random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send token to the user email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/${resetToken}`;

  const message = `Forgot your password? \nReset here: ${resetURL} \nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Your password reset token sent to your email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new Error("There was an error sending the email. Try again later!")
    );
  }
});

// @desc    Reset Password
// @route   PUT /api/v1/auth/resetPassword/:token
// @access  Public
export const resetPassword = expressAsyncHandler(async (req, res, next) => {
  const { password } = req.body;

  // Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // If token not expired, and there is user, set the new password
  if (!user) {
    return next(new Error("Token is invalid or has expired"));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();

  // Response
  res.status(200).json({
    status: "success",
    message: "Password updated successfully!",
    token: generateToken(user._id),
  });
});
