import { useState, useEffect, useCallback } from "react";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import api from "@/api/api";
import {
  Box,
  useTheme,
  Button,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
} from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import Svgs from "@/assets/Svgs";

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

interface Transaction {
  _id: string;
  amount: number;
  type: "revenue" | "expense";
  date: string;
  description: string;
}

interface Account {
  monthlyData: MonthlyData[];
  transactions: Transaction[];
  currentBalance: number;
  totalRevenue: number;
  totalExpenses: number;
}

const TransactionList = () => {
  const { palette } = useTheme();
  const [account, setAccount] = useState<Account | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState<
    Omit<Transaction, "_id">
  >({
    amount: 0,
    type: "revenue",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    isError: false,
  });

  const fetchAccountData = useCallback(async () => {
    try {
      const response = await api.getUserAccount(); // Fetch account data
      setAccount(response.data); // Set account data
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to fetch account data",
        isError: true,
      });
    }
  }, []); // Dependencies for useCallback can be adjusted if needed

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  const handleAddTransaction = async () => {
    try {
      await api.addTransaction(newTransaction);
      console.log(newTransaction);
      await fetchAccountData();
      setOpenAddDialog(false);
      setNewTransaction({
        amount: 0,
        type: "revenue",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setSnackbar({
        open: true,
        message: "Transaction added successfully",
        isError: false,
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to add transaction",
        isError: true,
      });
    }
  };

  const handleEditTransaction = async () => {
    if (selectedTransaction) {
      try {
        await api.updateTransaction({
          transactionId: selectedTransaction._id,
          ...newTransaction,
        });
        await fetchAccountData();
        setOpenEditDialog(false);
        setSelectedTransaction(null);
        setSnackbar({
          open: true,
          message: "Transaction updated successfully",
          isError: false,
        });
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to update transaction",
          isError: true,
        });
      }
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await api.deleteTransaction(id);
      await fetchAccountData();
      setSnackbar({
        open: true,
        message: "Transaction deleted successfully",
        isError: false,
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to delete transaction",
        isError: true,
      });
    }
  };

  const transactionColumns: GridColDef[] = [
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.35,
      renderCell: (params: GridCellParams) => {
        const amount = params.value ? Number(params.value) : 0;
        return `$${amount.toFixed(2)}`;
      },
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Desc.",
      flex: 0.67,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params: GridCellParams) => (
        <Box>
          <Button
            onClick={() => {
              setSelectedTransaction(params.row as Transaction);
              setNewTransaction({
                amount: params.row.amount,
                type: params.row.type,
                date: params.row.date,
                description: params.row.description,
              });
              setOpenEditDialog(true);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDeleteTransaction(params.row._id)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];
  return (
    <>
      <DashboardBox gridArea="f">
        <BoxHeader
          title={
            <Box display="flex" gap="10px" alignItems="center">
              {" "}
              {/* Added alignItems="center" */}
              <span style={{ color: palette.tertiary[200] }}>
                Recent Transactions
              </span>
              {/* Toggle Button */}
              <IconButton
                onClick={() => setOpenAddDialog(true)}
                size="small"
                sx={{
                  backgroundColor: "rgba(136, 132, 216, 0.1)", // Subtle background color
                  "&:hover": {
                    backgroundColor: "rgba(136, 132, 216, 0.2)", // Slightly darker on hover
                  },
                  borderRadius: "4px", // Optional: adjust the border radius
                }}
              >
                <Svgs.addSvg strokeColor="#12efc8" />
              </IconButton>
            </Box>
          }
          sideText={`${account?.transactions.length || 0} transactions`}
        />

        <Box
          mt="1rem"
          p="0 0.5rem"
          height="calc(100% - 80px)"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            rows={account?.transactions || []}
            columns={transactionColumns}
            getRowId={(row) => row._id}
            autoPageSize
          />
        </Box>
      </DashboardBox>

      {/* Add Transaction Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                amount: parseFloat(e.target.value),
              })
            }
            fullWidth
            margin="normal"
          />
          <Select
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                type: e.target.value as "revenue" | "expense",
              })
            }
            fullWidth
            margin="dense"
          >
            <MenuItem value="revenue">Revenue</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
          <TextField
            label="Date"
            type="date"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={newTransaction.description}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                description: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTransaction}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                amount: parseFloat(e.target.value),
              })
            }
            fullWidth
            margin="normal"
          />
          <Select
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                type: e.target.value as "revenue" | "expense",
              })
            }
            fullWidth
            margin="dense"
          >
            <MenuItem value="revenue">Revenue</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
          <TextField
            label="Date"
            type="date"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={newTransaction.description}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                description: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditTransaction}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        ContentProps={{
          sx: {
            backgroundColor: snackbar.isError ? "error.main" : "success.main",
          },
        }}
      />
    </>
  );
};

export default TransactionList;
