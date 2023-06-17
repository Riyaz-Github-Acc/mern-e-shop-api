import express from "express";

import verifyLogin from "../middlewares/verifyLogin.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
} from "../controllers/couponsController.js";

const router = express.Router();

router.post("/", verifyLogin, isAdmin, createCoupon);
router.put("/:id", verifyLogin, isAdmin, updateCoupon);
router.delete("/:id", verifyLogin, isAdmin, deleteCoupon);
router.get("/:id", getCoupon);
router.get("/", getAllCoupons);

export default router;
