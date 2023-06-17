import express from "express";

import verifyLogin from "../middlewares/verifyLogin.js";
import {
  profile,
  updateShippingAddress,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/profile", verifyLogin, profile);
router.put("/update/shipping", verifyLogin, updateShippingAddress);

export default router;
