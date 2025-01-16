import express from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStock,
} from "../controllers/productController";

const router = express.Router();

router.get("/products", getAllProducts);
router.post("/products", createProduct);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.patch("/products/:id/stock", updateProductStock); // New route for updating product stock

export default router;
