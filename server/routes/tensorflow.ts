import express from "express";
import { getFinancialPredictions } from "../controllers/tensorflowController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/predict", authMiddleware, getFinancialPredictions);

export default router;
