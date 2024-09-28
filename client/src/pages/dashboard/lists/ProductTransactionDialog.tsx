import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import api from "@/api/api";

interface User {
  _id: string;
  username: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  expense: number;
}

interface ProductTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (productTransactionData: {
    product: Product;
    type: "purchase" | "sale";
    quantity: number;
  }) => void;
}

export const ProductTransactionDialog: React.FC<
  ProductTransactionDialogProps
> = ({ open, onClose, onSubmit }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transactionType, setTransactionType] = useState<"purchase" | "sale">(
    "purchase"
  );
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.getUserProfile();
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userId = user?._id; // Adjusted to match the User interface

        if (!userId) {
          console.error("User ID is not available");
          return;
        }

        const response = await api.getProductsByUserId(user._id); // Fetch products by userId
        setProducts(response);
        console.log("Fetched products", response);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [user]);

  const handleSubmit = () => {
    if (selectedProduct && quantity > 0) {
      onSubmit({
        product: selectedProduct,
        type: transactionType,
        quantity,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Product Transaction</DialogTitle>
      <DialogContent>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <>
            <Select
              value={selectedProduct?._id || ""}
              onChange={(e) => {
                const product = products.find((p) => p._id === e.target.value);
                setSelectedProduct(product || null);
              }}
              fullWidth
              margin="dense"
            >
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={transactionType}
              onChange={(e) =>
                setTransactionType(e.target.value as "purchase" | "sale")
              }
              fullWidth
              margin="dense"
            >
              <MenuItem value="purchase">Purchase</MenuItem>
              <MenuItem value="sale">Sale</MenuItem>
            </Select>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              fullWidth
              margin="normal"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedProduct || quantity <= 0}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
