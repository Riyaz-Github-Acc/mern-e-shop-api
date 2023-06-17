import express from "express";

import verifyLogin from "../middlewares/verifyLogin.js";
import { createReview } from "../controllers/reviewsController.js";

const router = express.Router();

router.post("/:productID", verifyLogin, createReview);

export default router;
