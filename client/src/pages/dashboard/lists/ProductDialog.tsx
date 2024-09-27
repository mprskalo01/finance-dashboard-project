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
  }) => void;
  initialData?: { name: string; price: number; expense: number };
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
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price);
      setExpense(initialData.expense);
    }
  }, [initialData]);

  useEffect(() => {
    setIsValid(name.trim() !== "" && price > 0 && expense > 0);
  }, [name, price, expense]);

  const handleSubmit = () => {
    if (isValid) {
      onSubmit({ name, price, expense });
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDialog-paper": { minWidth: "300px", maxWidth: "400px" } }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          inputProps={{ maxLength: 30 }}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Price"
          type="text"
          fullWidth
          value={price}
          inputProps={{ maxLength: 10 }}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value) && Number(value) >= 0) {
              setPrice(Number(value));
            }
          }}
        />
        <TextField
          margin="dense"
          label="Expense"
          type="text"
          fullWidth
          value={expense}
          inputProps={{ maxLength: 10 }}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value) && Number(value) >= 0) {
              setExpense(Number(value));
            }
          }}
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
