import express from "express";

import verifyLogin from "../middlewares/verifyLogin.js";
import isAdmin from "../middlewares/isAdmin.js";
import { getSalesReport } from "../controllers/salesController.js";

const router = express.Router();

router.get("/", verifyLogin, isAdmin, getSalesReport);

export default router;
