import express from "express";

import verifyLogin from "../middlewares/verifyLogin.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", verifyLogin, createOrder);
router.put("/:id", verifyLogin, isAdmin, updateOrder);
router.get("/:id", verifyLogin, getOrder);
router.get("/", verifyLogin, getAllOrders);

export default router;
