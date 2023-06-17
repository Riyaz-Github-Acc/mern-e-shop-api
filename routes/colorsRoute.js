import express from "express";

import verifyLogin from "../middlewares/verifyLogin.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createColor,
  deleteColor,
  getAllColors,
  getColor,
  updateColor,
} from "../controllers/colorsController.js";

const router = express.Router();

router.post("/", verifyLogin, isAdmin, createColor);
router.put("/:id", verifyLogin, isAdmin, updateColor);
router.delete("/:id", verifyLogin, isAdmin, deleteColor);
router.get("/:id", getColor);
router.get("/", getAllColors);

export default router;
