import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useProductContext } from "@/context/ProductContext/useProduct";

interface Product {
  _id: string;
  name: string;
  price: number;
  expense: number;
  inStock: number;
}

interface CombinedTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transactionData: {
    amount: number;
    type: "revenue" | "expense";
    description: string;
    date: string;
  }) => void;
  initialData?: {
    amount: number;
    type: "revenue" | "expense";
    description: string;
    date: string;
  };
  title: string;
}

export const CombinedTransactionDialog: React.FC<
  CombinedTransactionDialogProps
> = ({ open, onClose, onSubmit, initialData, title }) => {
  const { products, updateProductStock } = useProductContext();
  const [mode, setMode] = useState<"regular" | "product">("regular");

  // Regular transaction state
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [type, setType] = useState<"revenue" | "expense">(
    initialData?.type || "revenue"
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split("T")[0]
  );
  const [isValid, setIsValid] = useState(false);

  // Product transaction state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transactionType, setTransactionType] = useState<"purchase" | "sale">(
    "purchase"
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setType(initialData.type);
      setDescription(initialData.description);
      setDate(initialData.date || new Date().toISOString().split("T")[0]);
    }
  }, [initialData]);

  useEffect(() => {
    setIsValid(amount > 0 && description.trim() !== "");
  }, [amount, type, description]);

  const handleSubmit = () => {
    if (mode === "regular" && isValid) {
      onSubmit({ amount, type, description, date });
      onClose();
    } else if (mode === "product" && selectedProduct && quantity > 0) {
      if (transactionType === "sale" && selectedProduct.inStock < quantity) {
        alert("Not enough products in stock for this sale.");
        return;
      }

      const transactionAmount =
        transactionType === "purchase"
          ? selectedProduct.expense * quantity
          : selectedProduct.price * quantity;
      const transactionTypeFinal: "revenue" | "expense" =
        transactionType === "purchase" ? "expense" : "revenue";
      const transactionDescription = `${transactionType} of ${quantity} ${selectedProduct.name}`;

      const newProductTransaction = {
        amount: transactionAmount,
        type: transactionTypeFinal,
        date: new Date().toISOString().split("T")[0],
        description: transactionDescription,
      };

      updateProductStock(selectedProduct._id, quantity, transactionType);
      onSubmit(newProductTransaction);
      onClose();
    }
  };


  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_e, newMode) => setMode(newMode)}
          fullWidth
        >
          <ToggleButton value="regular">Regular Transaction</ToggleButton>
          <ToggleButton value="product">Product Transaction</ToggleButton>
        </ToggleButtonGroup>
        {mode === "regular" ? (
          <>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              fullWidth
              margin="normal"
            />
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as "revenue" | "expense")}
              fullWidth
              margin="dense"
            >
              <MenuItem value="revenue">Revenue</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
            {initialData && (
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
          </>
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
          disabled={
            (mode === "regular" && !isValid) ||
            (mode === "product" && (!selectedProduct || quantity <= 0))
          }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
