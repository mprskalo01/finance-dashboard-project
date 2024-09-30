import { useState } from "react";
import { Box, IconButton, Snackbar, useTheme } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import {
  TransactionDialog,
  DeleteConfirmationDialog,
} from "./TransactionDialog";
import DashboardBox from "@/components/DashboardBox";
import BoxHeader from "@/components/BoxHeader";
import Svgs from "@/assets/Svgs";
import api from "@/api/api";
import { useAccount } from "@/context/AccountContext/UseAccount";
import { useProductContext } from "@/context/ProductContext/useProduct";
import { CombinedTransactionDialog } from "./CombinedTransactionDialog";

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
  const { products, revertProductStock } = useProductContext();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [newTransaction] = useState<Omit<Transaction, "_id">>({
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

  const handleTransactionSubmit = async (
    transactionData: Omit<Transaction, "_id">
  ) => {
    const date = new Date().toISOString().split("T")[0];
    const month = new Date()
      .toLocaleString("default", { month: "long" })
      .toLowerCase();

    try {
      await api.addTransaction({ ...transactionData, date });

      // Update monthlyData
      const monthData = account?.monthlyData.find((m) => m.month === month);
      if (monthData) {
        monthData.revenue +=
          transactionData.type === "revenue" ? transactionData.amount : 0;
        monthData.expenses +=
          transactionData.type === "expense" ? transactionData.amount : 0;
      } else {
        account?.monthlyData.push({
          month,
          revenue:
            transactionData.type === "revenue" ? transactionData.amount : 0,
          expenses:
            transactionData.type === "expense" ? transactionData.amount : 0,
        });
      }

      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Transaction processed successfully",
        isError: false,
      });
      fetchUserAccount(); // Refetch account data
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to process transaction",
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

        // Update monthlyData
        const date = new Date(transactionData.date);
        const month = date
          .toLocaleString("default", { month: "long" })
          .toLowerCase();
        const monthData = account?.monthlyData.find((m) => m.month === month);
        if (monthData) {
          // Update logic for monthlyData
        } else {
          // Add new monthData if not found
        }

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
        // Check if the transaction is a product transaction
        const { description } = selectedTransaction;
        const productTransactionMatch = description.match(
          /(purchase|sale) of (\d+) (.+)/
        );
        if (productTransactionMatch) {
          const [, transactionType, quantityStr, productName] =
            productTransactionMatch;
          const quantity = parseInt(quantityStr, 10);
          const product = products.find((p) => p.name === productName);
          if (product) {
            revertProductStock(
              product._id,
              quantity,
              transactionType as "purchase" | "sale"
            );
          }
        }

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
                onClick={() => setOpenDialog(true)}
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
              Array.isArray(account?.transactions) ? account.transactions : []
            }
            columns={transactionColumns}
            getRowId={(row) => row._id}
            initialState={{
              sorting: {
                sortModel: [{ field: "date", sort: "desc" }],
              },
            }}
          />
        </Box>
      </DashboardBox>

      <CombinedTransactionDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleTransactionSubmit}
        initialData={newTransaction}
        title="Transaction"
      />

      <TransactionDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={(transactionData) =>
          handleEditTransaction({
            ...transactionData,
            date:
              transactionData.date || new Date().toISOString().split("T")[0], // Ensure date is always a string
          })
        }
        initialData={newTransaction}
        title="Edit Transaction"
      />

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteTransaction}
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
