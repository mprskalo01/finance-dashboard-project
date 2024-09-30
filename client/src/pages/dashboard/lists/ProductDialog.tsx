import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (productData: {
    name: string;
    price: number;
    expense: number;
    inStock: number; // Add inStock to the productData type
  }) => void;
  initialData?: {
    name: string;
    price: number;
    expense: number;
    inStock: number; // Add inStock to the initialData type
  };
  title: string;
}

export const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price || 1);
  const [expense, setExpense] = useState(initialData?.expense || 1);
  const [inStock, setInStock] = useState(initialData?.inStock || 0); // Add inStock state
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price);
      setExpense(initialData.expense);
      setInStock(initialData.inStock); // Ensure inStock is handled
    }
  }, [initialData]);

  useEffect(() => {
    setIsValid(name.trim() !== "" && price > 0 && expense > 0 && inStock >= 0); // Ensure inStock is handled
  }, [name, price, expense, inStock]);

  const handleSubmit = () => {
    if (isValid) {
      onSubmit({ name, price, expense, inStock });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Expense"
          type="number"
          value={expense}
          onChange={(e) => setExpense(parseFloat(e.target.value))}
          fullWidth
          margin="normal"
        />
        <TextField
          label="In Stock"
          type="number"
          value={inStock}
          onChange={(e) => setInStock(parseInt(e.target.value, 10))}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!isValid}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const DeleteConfirmationDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this product?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
