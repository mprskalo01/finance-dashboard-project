import { useState } from "react";
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
import { useAccount } from "@/context/AccountContext/UseAccount";

interface Transaction {
  _id: string;
  amount: number;
  type: "revenue" | "expense";
  date: string;
  description: string;
}

const TransactionList = () => {
  const { palette } = useTheme();
  const { account, fetchUserAccount } = useAccount();
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

  const handleAddTransaction = async () => {
    try {
      await api.addTransaction(newTransaction);
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
      fetchUserAccount(); // Refetch account data
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
        setOpenEditDialog(false);
        setSelectedTransaction(null);
        setSnackbar({
          open: true,
          message: "Transaction updated successfully",
          isError: false,
        });
        fetchUserAccount(); // Refetch account data
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
      setSnackbar({
        open: true,
        message: "Transaction deleted successfully",
        isError: false,
      });
      fetchUserAccount(); // Refetch account data
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
      flex: 0.4,
    },
    {
      field: "description",
      headerName: "Desc.",
      flex: 0.5,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.4,
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
              <span style={{ color: palette.tertiary[200] }}>
                Recent Transactions
              </span>
              <IconButton
                onClick={() => setOpenAddDialog(true)}
                size="small"
                sx={{
                  backgroundColor: "rgba(136, 132, 216, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(136, 132, 216, 0.2)",
                  },
                  borderRadius: "4px",
                }}
              >
                <Svgs.addSvg strokeColor="#12efc8" />
              </IconButton>
            </Box>
          }
          sideText={
            account?.transactions.length === 0
              ? "No transactions stored"
              : `${account?.transactions.length} transaction${
                  (account?.transactions?.length ?? 0) > 1 ? "s" : ""
                }`
          }
        />

        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
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
            autoPageSize
            hideFooter={true}
            rows={
              Array.isArray(account?.transactions) ? account.transactions : []
            }
            columns={transactionColumns}
            getRowId={(row) => row._id}
          />
        </Box>
      </DashboardBox>

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
