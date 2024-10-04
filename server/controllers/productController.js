import Product from "../models/Product.js";
import mongoose from "mongoose";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("userId", "name email");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  const { userId, name, price, expense, inStock } = req.body;

  const newProduct = new Product({
    userId,
    name,
    price: price,
    expense: expense,
    inStock,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("userId", "name email");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { userId, name, price, expense, inStock } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        userId,
        name,
        price: price,
        expense: expense,
        inStock,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Update product stock
export const updateProductStock = async (req, res) => {
  const { id } = req.params;
  const { quantity, type } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (type === "sale" && product.inStock < quantity) {
      return res.status(400).json({ message: "Not enough products in stock" });
    }

    product.inStock =
      type === "purchase"
        ? product.inStock + quantity
        : product.inStock - quantity;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product stock", error });
  }
};
