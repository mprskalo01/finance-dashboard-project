import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  IconButton,
  Modal,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import DashboardBox from "@/components/DashboardBox";
import { useUser } from "@/hooks/userHooks";
import BoxHeader from "@/components/BoxHeader";
import Svgs from "@/assets/Svgs";
import { useAccount } from "@/context/AccountContext/UseAccount"; // Import useAccount

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

interface User {
  _id: string;
  name: string;
  email: string;
}

function AccountStats() {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // New state for delete confirmation dialog
  const [editedAccount, setEditedAccount] = useState<Partial<Account>>({});
  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const { handleLogout } = useUser();
  const { account, fetchUserAccount } = useAccount(); // Use account context

  const buttonClick = () => {
    handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.getUserProfile();
        setUser(response.data);
        setEditUserData({
          name: response.data.name,
          email: response.data.email,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditAccount = () => {
    setEditedAccount({
      currentBalance: account?.currentBalance || 0,
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
      await fetchUserAccount(); // Refresh account data
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditUser = () => {
    setIsEditUserModalOpen(true);
  };

  const handleCloseEditUserModal = () => {
    setIsEditUserModalOpen(false);
  };

  const handleUserInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setEditUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUserChanges = async () => {
    if (editUserData.newPassword !== editUserData.confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    // Check if the current password is correct
    const isPasswordCorrect = await api.verifyCurrentPassword(
      user?.email || "",
      editUserData.currentPassword
    );
    if (!isPasswordCorrect) {
      alert("Wrong Current Password Entered");
      setEditUserData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
      return;
    }

    try {
      await api.updateUserProfile({
        name: editUserData.name,
        email: editUserData.email,
        ...(editUserData.newPassword && {
          newPassword: editUserData.newPassword,
        }),
      });
      setIsEditUserModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.deleteSelf();
      handleLogout();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <DashboardBox gridArea="i">
        <BoxHeader
          title={
            <Box display="flex" gap="10px" alignItems="center">
              <span style={{ color: palette.primary[500] }}>
                Account stats:
              </span>
            </Box>
          }
          sideText={`${user?.name}`}
        />
        <Box mt={2} sx={{ px: 2, pb: 2, pt: 0 }}>
          <Typography variant="h3" color={palette.grey[300]}>
            Your current account balance is:{" "}
            <Typography
              variant="h2"
              component="span"
              fontWeight="bold"
              color={palette.primary[500]}
            >
              ${account?.currentBalance.toFixed(2)}
              <IconButton
                onClick={handleEditAccount}
                size="small"
                sx={{
                  backgroundColor: "rgba(18, 239, 200, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(18, 239, 200, 0.2)",
                  },
                  borderRadius: "4px",
                  marginLeft: "10px",
                }}
              >
                <Svgs.editSvg fillColor="#0ea5e9" size="16px" />
              </IconButton>
            </Typography>
          </Typography>
          <Typography variant="h3" color={palette.grey[300]}>
            Your total revenue is:{" "}
            <Typography
              variant="h4" // Changed from h3 to h4
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
              variant="h4" // Changed from h3 to h4
              component="span"
              fontWeight="bold"
              color={palette.secondary[500]}
            >
              ${account?.totalExpenses.toFixed(2)}
            </Typography>
          </Typography>
          <Typography variant="h3" color={palette.grey[300]}>
            Your total profit is:{" "}
            <Typography
              variant="h4" // Changed from h3 to h4
              component="span"
              fontWeight="bold"
              color={palette.primary[500]}
            >
              $
              {(
                (account?.totalRevenue ?? 0) - (account?.totalExpenses ?? 0)
              ).toFixed(2)}
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
            sx={{ mt: 1, ml: 2 }}
          >
            Logout
          </Button>
          <Button
            variant="contained"
            onClick={handleEditUser}
            sx={{
              mt: 1,
              ml: 2,
              backgroundColor: palette.grey[700],
              color: palette.grey[100],
            }}
          >
            Edit User
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

      <Dialog
        open={isEditUserModalOpen}
        onClose={handleCloseEditUserModal}
        aria-labelledby="edit-user-modal"
        aria-describedby="modal-to-edit-user-info"
      >
        <DialogTitle
          style={{
            backgroundColor: palette.grey[700],
            color: palette.grey[100],
          }}
        >
          Edit User Info
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: palette.grey[700],
            color: palette.grey[100],
          }}
        >
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={editUserData.name}
            onChange={handleUserInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={editUserData.email}
            onChange={handleUserInputChange}
          />
          <TextField
            margin="dense"
            name="currentPassword"
            label="Current Password"
            type="password"
            fullWidth
            value={editUserData.currentPassword}
            onChange={handleUserInputChange}
          />
          <TextField
            margin="dense"
            name="newPassword"
            label="New Password"
            type="password"
            fullWidth
            value={editUserData.newPassword}
            onChange={handleUserInputChange}
          />
          <TextField
            margin="dense"
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={editUserData.confirmNewPassword}
            onChange={handleUserInputChange}
            onBlur={() => {
              if (
                editUserData.newPassword !== editUserData.confirmNewPassword
              ) {
                setEditUserData((prev) => ({
                  ...prev,
                  newPassword: "",
                  confirmNewPassword: "",
                }));
                alert("New passwords do not match");
              }
            }}
          />
        </DialogContent>
        <DialogActions
          style={{
            backgroundColor: palette.grey[700],
            color: palette.grey[100],
          }}
        >
          <Button
            onClick={handleCloseEditUserModal}
            style={{
              backgroundColor: palette.secondary[500],
              color: "#000",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveUserChanges}
            style={{
              backgroundColor: palette.primary[500],
              color: "#000",
            }}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setIsDeleteConfirmOpen(true)} // Open confirmation dialog
            sx={{ mt: 1, ml: 2 }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        aria-labelledby="delete-confirmation-dialog"
        aria-describedby="dialog-to-confirm-account-deletion"
      >
        <DialogTitle
          style={{
            backgroundColor: palette.grey[700],
            color: palette.grey[100],
          }}
        >
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: palette.grey[700],
            color: palette.grey[100],
          }}
        >
          <Typography>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions
          style={{
            backgroundColor: palette.grey[700],
            color: palette.grey[100],
          }}
        >
          <Button
            onClick={() => setIsDeleteConfirmOpen(false)}
            style={{
              backgroundColor: palette.secondary[500],
              color: "#000",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            style={{
              backgroundColor: "red",
              color: "#000",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AccountStats;
