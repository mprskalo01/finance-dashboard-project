import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import DashboardBox from "@/components/DashboardBox";
import CombinedChart from "./charts/CombinedChart";
import ProductList from "./lists/ProductList";
import { useUser } from "@/hooks/userHooks";
import BoxHeader from "@/components/BoxHeader";
import Svgs from "@/assets/Svgs";

interface User {
  _id: string;
  username: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

interface Account {
  monthlyData: MonthlyData[];
  currentBalance: number;
  totalRevenue: number;
  totalExpenses: number;
}

const Row3 = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedAccount, setEditedAccount] = useState<Partial<Account>>({});

  const { handleLogout } = useUser();

  const buttonClick = () => {
    handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.getUserProfile();
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUserAccount = async () => {
      try {
        const response = await api.getUserAccount();
        setAccount(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserProfile();
    fetchUserAccount();
  }, []);

  const handleEditAccount = () => {
    setEditedAccount({
      currentBalance: account?.currentBalance || 0,
      totalRevenue: account?.totalRevenue || 0,
      totalExpenses: account?.totalExpenses || 0,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedAccount((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSaveChanges = async () => {
    try {
      await api.updateAccount(editedAccount);
      const updatedAccount = await api.getUserAccount();
      setAccount(updatedAccount.data);
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <CombinedChart />
      <ProductList />
      <DashboardBox gridArea="i" sx={{ p: 2 }}>
        <BoxHeader
          title={
            <Box display="flex" gap="10px" alignItems="center">
              <span style={{ color: palette.primary[500] }}>
                Account balance:
              </span>
              <IconButton
                onClick={handleEditAccount}
                size="small"
                sx={{
                  backgroundColor: "rgba(18, 239, 200, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(18, 239, 200, 0.2)",
                  },
                  borderRadius: "4px",
                }}
              >
                <Svgs.editSvg fillColor="#0ea5e9" />
              </IconButton>
            </Box>
          }
          sideText={`Welcome, ${user?.username}!`}
        />
        <Box mt={2}>
          <Typography variant="h3" color={palette.grey[300]}>
            Your current account balance is:{" "}
            <Typography
              variant="h2"
              component="span"
              fontWeight="bold"
              color={palette.primary[500]}
            >
              ${account?.currentBalance.toFixed(2)}
            </Typography>
          </Typography>
          <Typography variant="h3" color={palette.grey[300]}>
            Your total revenue is:{" "}
            <Typography
              variant="h3"
              component="span"
              fontWeight="bold"
              color={palette.tertiary[500]}
            >
              ${account?.totalRevenue.toFixed(2)}
            </Typography>
          </Typography>
          <Typography variant="h3" color={palette.grey[300]}>
            Your total expenses are:{" "}
            <Typography
              variant="h3"
              component="span"
              fontWeight="bold"
              color={palette.secondary[500]}
            >
              ${account?.totalExpenses.toFixed(2)}
            </Typography>
          </Typography>
        </Box>
        <Typography
          variant="h3"
          fontWeight="bold"
          color={palette.secondary[300]}
          sx={{ my: "1rem" }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={buttonClick}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Typography>
      </DashboardBox>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="edit-account-modal"
        aria-describedby="modal-to-edit-account-stats"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            color: palette.grey[100],
            bgcolor: palette.grey[600],
            boxShadow: 24,
            p: 4,
            borderRadius: "2rem",
          }}
        >
          <Typography
            variant="h4"
            component="h3"
            color={palette.primary[500]}
            gutterBottom
          >
            Edit Account Stats
          </Typography>
          <TextField
            fullWidth
            label="Current Balance"
            type="number"
            name="currentBalance"
            sx={{ backgroundColor: palette.grey[200] }}
            value={editedAccount.currentBalance}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Total Revenue"
            type="number"
            name="totalRevenue"
            sx={{ backgroundColor: palette.grey[200] }}
            value={editedAccount.totalRevenue}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Total Expenses"
            type="number"
            name="totalExpenses"
            sx={{ backgroundColor: palette.grey[200] }}
            value={editedAccount.totalExpenses}
            onChange={handleInputChange}
            margin="normal"
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleCloseModal}
              sx={{
                mr: 1,
                backgroundColor: palette.secondary[500],
                color: palette.grey[700],
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Row3;
