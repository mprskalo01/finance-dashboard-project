import express from "express";
import { getFinancialPredictions } from "../controllers/tensorflowController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Adjust the path as needed

const router = express.Router();

router.post("/predict", authMiddleware, getFinancialPredictions);

export default router;
