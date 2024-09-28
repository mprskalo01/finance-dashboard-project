import { useState } from "react";
import { Box, IconButton, Snackbar, useTheme } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import {
  TransactionDialog,
  DeleteConfirmationDialog,
} from "./TransactionDialog";
import { ProductTransactionDialog } from "./ProductTransactionDialog";
import DashboardBox from "@/components/DashboardBox";
import BoxHeader from "@/components/BoxHeader";
import Svgs from "@/assets/Svgs";
import api from "@/api/api";
import { useAccount } from "@/context/AccountContext/UseAccount";

interface Product {
  _id: string;
  name: string;
  price: number;
  expense: number;
}

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProductTransactionDialog, setOpenProductTransactionDialog] =
    useState(false);
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

  const handleAddTransaction = async (
    transactionData: Omit<Transaction, "_id">
  ) => {
    try {
      await api.addTransaction(transactionData);
      console.log(transactionData);
      setOpenAddDialog(false);
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

  const handleEditTransaction = async (
    transactionData: Omit<Transaction, "_id">
  ) => {
    if (selectedTransaction) {
      try {
        await api.updateTransaction({
          transactionId: selectedTransaction._id,
          ...transactionData,
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

  const handleDeleteTransaction = async () => {
    if (selectedTransaction) {
      try {
        await api.deleteTransaction(selectedTransaction._id);
        setSnackbar({
          open: true,
          message: "Transaction deleted successfully",
          isError: false,
        });
        fetchUserAccount(); // Refetch account data
        setOpenDeleteDialog(false);
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to delete transaction",
          isError: true,
        });
      }
    }
  };

  const handleProductTransactionSubmit = async (productTransactionData: {
    product: Product;
    type: "purchase" | "sale";
    quantity: number;
  }) => {
    const { product, type, quantity } = productTransactionData;
    const transactionAmount =
      type === "purchase"
        ? product.expense * quantity
        : product.price * quantity;
    const transactionType = type === "purchase" ? "expense" : "revenue";
    const transactionDescription = `${type} of ${quantity} ${product.name}`;

    const newProductTransaction: Omit<Transaction, "_id"> = {
      amount: transactionAmount,
      type: transactionType,
      date: new Date().toISOString().split("T")[0],
      description: transactionDescription,
    };

    try {
      console.log("Sending transaction:", newProductTransaction);
      await api.addTransaction(newProductTransaction);
      console.log("Transaction added successfully:", newProductTransaction);
      setOpenProductTransactionDialog(false);
      setSnackbar({
        open: true,
        message: "Product transaction added successfully",
        isError: false,
      });
      fetchUserAccount(); // Refetch account data to refresh the DataGrid
    } catch (err) {
      console.error("Failed to add product transaction:", err);
      setSnackbar({
        open: true,
        message: "Failed to add product transaction",
        isError: true,
      });
    }
  };

  const transactionColumns: GridColDef[] = [
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.3,
      renderCell: (params: GridCellParams) => {
        const amount = params.value ? Number(params.value) : 0;
        return `$${amount.toFixed(2)}`;
      },
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.2,
    },
    {
      field: "description",
      headerName: "Desc.",
      flex: 0.5,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.25,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.25,
      renderCell: (params: GridCellParams) => (
        <Box>
          <IconButton
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
            style={{ backgroundColor: "rgba(0, 0, 0, 0.1)", margin: "0 5px" }}
          >
            <Svgs.editSvg fillColor="#fff" size="12px" />
          </IconButton>
          <IconButton
            onClick={() => {
              setSelectedTransaction(params.row as Transaction);
              setOpenDeleteDialog(true);
            }}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.1)", margin: "0 5px" }}
          >
            <Svgs.deleteSvg fillColor="#fff" />
          </IconButton>
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
              <IconButton
                onClick={() => setOpenProductTransactionDialog(true)}
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
          height="75%" // Set the height to 75%
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
            // "& .MuiDataGrid-columnSeparator": {
            //   visibility: "hidden",
            // },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={
              Array.isArray(account?.transactions)
                ? account.transactions.slice().reverse()
                : []
            }
            columns={transactionColumns}
            getRowId={(row) => row._id}
          />
        </Box>
      </DashboardBox>

      <TransactionDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddTransaction}
        title="Add New Transaction"
      />

      <TransactionDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={handleEditTransaction}
        initialData={newTransaction}
        title="Edit Transaction"
      />

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteTransaction}
      />

      <ProductTransactionDialog
        open={openProductTransactionDialog}
        onClose={() => setOpenProductTransactionDialog(false)}
        onSubmit={handleProductTransactionSubmit}
      />

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
