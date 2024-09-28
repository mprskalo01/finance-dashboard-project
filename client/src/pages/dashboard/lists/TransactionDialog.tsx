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
} from "@mui/material";

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transactionData: {
    amount: number;
    type: "revenue" | "expense";
    date: string;
    description: string;
  }) => void;
  initialData?: {
    amount: number;
    type: "revenue" | "expense";
    date: string;
    description: string;
  };
  title: string;
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [type, setType] = useState<"revenue" | "expense">(
    initialData?.type || "revenue"
  );
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setType(initialData.type);
      setDate(initialData.date);
      setDescription(initialData.description);
    }
  }, [initialData]);

  useEffect(() => {
    setIsValid(amount > 0 && description.trim() !== "");
  }, [amount, type, date, description]);

  const handleSubmit = () => {
    if (isValid) {
      onSubmit({ amount, type, date, description });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
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
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        Are you sure you want to delete this transaction?
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
