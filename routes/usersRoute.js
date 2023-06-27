import express from "express";

import pictureUpload from "../config/pictureUpload.js";
import verifyLogin from "../middlewares/verifyLogin.js";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../controllers/authController.js";
import {
  deleteUser,
  getAllUsers,
  profile,
  updateShippingAddress,
  updateUser,
} from "../controllers/usersController.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/register", pictureUpload.single("file"), register);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:token", resetPassword);

router.get("/profile", verifyLogin, profile);
router.put("/update/shipping", verifyLogin, updateShippingAddress);

router.put("/update/:id", verifyLogin, updateUser);
router.delete("/delete/:id", verifyLogin, deleteUser);
router.get("/", verifyLogin, isAdmin, getAllUsers);

export default router;
