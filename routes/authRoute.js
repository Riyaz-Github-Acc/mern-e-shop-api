import express from "express";

import pictureUpload from "../config/pictureUpload.js";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", pictureUpload.single("file"), register);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);

export default router;
