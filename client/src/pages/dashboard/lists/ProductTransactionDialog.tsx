import React, { useState } from "react";
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
import { useProductContext } from "@/context/ProductContext/useProduct";

interface Product {
  _id: string;
  name: string;
  price: number;
  expense: number;
  inStock: number; // Add inStock to the Product interface
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
  const { products, updateProductStock } = useProductContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transactionType, setTransactionType] = useState<"purchase" | "sale">(
    "purchase"
  );
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async () => {
    if (selectedProduct && quantity > 0) {
      if (transactionType === "sale" && selectedProduct.inStock < quantity) {
        alert("Not enough products in stock for this sale transaction.");
        return;
      }

      onSubmit({
        product: selectedProduct,
        type: transactionType,
        quantity,
      });

      try {
        await updateProductStock(
          selectedProduct._id,
          quantity,
          transactionType
        );
      } catch (error) {
        console.error("Failed to update product stock:", error);
      }

      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Product Transaction</DialogTitle>
      <DialogContent>
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
