import Product from "../models/productModel.js"; // Adjust the import path as necessary
import mongoose from "mongoose";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("userId", "name email"); // Adjust the fields as needed
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  const { userId, name, price, expense } = req.body;

  const newProduct = new Product({
    userId,
    name,
    price: price * 100, // Convert to cents
    expense: expense * 100, // Convert to cents
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
  const { userId, name, price, expense } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        userId,
        name,
        price: price * 100, // Convert to cents
        expense: expense * 100, // Convert to cents
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
