import express from "express";

import verifyLogin from "../middlewares/verifyLogin.js";
import isAdmin from "../middlewares/isAdmin.js";
import upload from "../config/fileUpload.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/productsController.js";

const router = express.Router();

router.post("/", verifyLogin, isAdmin, upload.array("files"), createProduct);
router.put("/:id", verifyLogin, isAdmin, updateProduct);
router.delete("/:id", verifyLogin, isAdmin, deleteProduct);
router.get("/:id", getProduct);
router.get("/", getAllProducts);

export default router;
