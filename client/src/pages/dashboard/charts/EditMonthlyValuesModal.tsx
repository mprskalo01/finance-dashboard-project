import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  useTheme,
} from "@mui/material";
import type { MonthlyData } from "./CombinedChart"; // Adjust the import path as needed

interface EditMonthlyValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyData: MonthlyData[];
  editingMonths: { [key: string]: MonthlyData };
  handleInputChange: (
    month: string,
    field: "revenue" | "expenses",
    value: string
  ) => void;
  handleSaveChanges: () => void;
}

const EditMonthlyValuesModal: React.FC<EditMonthlyValuesModalProps> = ({
  isOpen,
  onClose,
  monthlyData,
  editingMonths,
  handleInputChange,
  handleSaveChanges,
}) => {
  const { palette } = useTheme();

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40rem",
          bgcolor: palette.grey[700],
          boxShadow: 24,
          p: 3,
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: "1.5rem",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Edit Monthly Values
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
          }}
        >
          {monthlyData.map((month) => (
            <Box
              key={month.month}
              sx={{
                bgcolor: palette.grey[800],
                p: 2,
                borderRadius: "0.5rem",
              }}
            >
              <Typography variant="subtitle2">{month.month}</Typography>
              <TextField
                label="Revenue"
                type="number"
                value={editingMonths[month.month]?.revenue || ""}
                onChange={(e) =>
                  handleInputChange(month.month, "revenue", e.target.value)
                }
                fullWidth
                margin="dense"
                size="small"
              />
              <TextField
                label="Expenses"
                type="number"
                value={editingMonths[month.month]?.expenses || ""}
                onChange={(e) =>
                  handleInputChange(month.month, "expenses", e.target.value)
                }
                fullWidth
                margin="dense"
                size="small"
              />
            </Box>
          ))}
          {/* Add empty boxes to fill the grid */}
          {[...Array(3 - (monthlyData.length % 3)).keys()].map((_, index) => (
            <Box key={`empty-${index}`} />
          ))}
        </Box>
        <Box mt={1.5} display="flex" justifyContent="flex-end">
          <Button
            onClick={onClose}
            sx={{
              mr: 1,
              backgroundColor: palette.secondary[500],
              color: palette.grey[700],
              fontSize: "0.875rem",
              padding: "0.5rem 1rem",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            sx={{
              backgroundColor: palette.primary[500],
              color: palette.grey[700],
              fontSize: "0.875rem",
              padding: "0.5rem 1rem",
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditMonthlyValuesModal;
