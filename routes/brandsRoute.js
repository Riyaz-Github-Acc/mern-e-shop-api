import express from "express";

import verifyLogin from "../middlewares/verifyLogin.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand,
} from "../controllers/brandsController.js";

const router = express.Router();

router.post("/", verifyLogin, isAdmin, createBrand);
router.put("/:id", verifyLogin, isAdmin, updateBrand);
router.delete("/:id", verifyLogin, isAdmin, deleteBrand);
router.get("/:id", getBrand);
router.get("/", getAllBrands);

export default router;
