import express from "express";

import verifyLogin from "../middlewares/verifyLogin.js";
import isAdmin from "../middlewares/isAdmin.js";
import categoryImgUpload from "../config/categoryImgUpload.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoriesController.js";

const router = express.Router();

router.post(
  "/",
  verifyLogin,
  isAdmin,
  categoryImgUpload.single("file"),
  createCategory
);

router.put("/:id", verifyLogin, isAdmin, updateCategory);
router.delete("/:id", verifyLogin, isAdmin, deleteCategory);
router.get("/:id", getCategory);
router.get("/", getAllCategories);

export default router;
