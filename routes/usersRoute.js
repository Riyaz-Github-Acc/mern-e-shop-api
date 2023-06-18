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
  profile,
  updateShippingAddress,
} from "../controllers/usersController.js";

const router = express.Router();

router.post("/register", pictureUpload.single("file"), register);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:token", resetPassword);

router.get("/profile", verifyLogin, profile);
router.put("/update/shipping", verifyLogin, updateShippingAddress);

export default router;
