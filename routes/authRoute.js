import express from "express";

import pictureUpload from "../config/pictureUpload.js";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", pictureUpload.single("file"), register);
router.post("/login", login);

export default router;
