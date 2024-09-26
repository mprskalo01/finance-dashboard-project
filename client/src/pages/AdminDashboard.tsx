import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/userHooks"; // Adjust the import path as needed
import DashboardBox from "@/components/DashboardBox";

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface EditUserData {
  username: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const AdminDashboard: React.FC = () => {
  const { palette } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState<EditUserData>({
    username: "",
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const navigate = useNavigate();
  const { getAllUsers, updateUser, deleteUser, handleLogout } = useUser();

  const buttonClick = () => {
    handleLogout(); // Perform logout
    navigate("/login"); // Redirect to login page
  };

  // Fetch users directly inside the useEffect without adding it to dependencies.
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers();
      if (response?.data) {
        setUsers(response.data);
      }
    };

    fetchUsers();
  }, [getAllUsers]); // Assuming getAllUsers is stable or a custom hook

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: "",
      isAdmin: user.isAdmin,
    });
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      const { password, ...updateData } = editUserData;

      // Check if password exists, and include it in the update data if so
      if (password) {
        (updateData as EditUserData).password = password;
      }

      const updatedUser = await updateUser(editingUser._id, updateData);
      if (updatedUser) {
        // Fetch users again after updating to refresh the list
        const response = await getAllUsers();
        if (response?.data) {
          setUsers(response.data);
        }
        setEditingUser(null);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const deletedUser = await deleteUser(userId);
    if (deletedUser) {
      setUsers(users.filter((user) => user._id !== userId));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUserData((prev) => ({ ...prev, isAdmin: e.target.checked }));
  };

  return (
    <DashboardBox
      style={{
        padding: "20px",
        backgroundColor: palette.grey[700],
        color: palette.grey[100],
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center" // Ensure both the button and the heading are vertically aligned
      >
        <Typography
          variant="h1"
          color={palette.grey[100]} // Ensure text color is grey[100]
          sx={{ pb: "5rem", fontWeight: "bold" }} // Slight gray color for the heading
        >
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={buttonClick}
          sx={{ ml: 2 }} // Add margin to the left for spacing
        >
          Logout
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: palette.grey[800] }}>
              <TableCell style={{ color: palette.grey[100] }}>
                Username
              </TableCell>
              <TableCell style={{ color: palette.grey[100] }}>Name</TableCell>
              <TableCell style={{ color: palette.grey[100] }}>Email</TableCell>
              <TableCell style={{ color: palette.grey[100] }}>Admin</TableCell>
              <TableCell style={{ color: palette.grey[100] }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                style={{ backgroundColor: palette.grey[800] }}
              >
                <TableCell style={{ color: palette.grey[100] }}>
                  {user.username}
                </TableCell>
                <TableCell style={{ color: palette.grey[100] }}>
                  {user.name}
                </TableCell>
                <TableCell style={{ color: palette.grey[100] }}>
                  {user.email}
                </TableCell>
                <TableCell style={{ color: palette.grey[100] }}>
                  {user.isAdmin ? "Yes" : "No"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEditUser(user)}
                    variant="contained"
                    color="primary"
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteUser(user._id)}
                    variant="contained"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingUser} onClose={() => setEditingUser(null)}>
        <DialogTitle
          style={{
            backgroundColor: palette.grey[700],
            color: palette.grey[100],
          }}
        >
          Edit User
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: palette.grey[700],
            color: palette.grey[100],
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            value={editUserData.username}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={editUserData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={editUserData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={editUserData.password}
            onChange={handleInputChange}
            placeholder="Leave blank to keep current password"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editUserData.isAdmin}
                onChange={handleCheckboxChange}
                name="isAdmin"
              />
            }
            label="Admin"
          />
        </DialogContent>
        <DialogActions
          style={{
            backgroundColor: palette.grey[700],
            color: palette.grey[100],
          }}
        >
          <Button
            onClick={() => setEditingUser(null)}
            style={{
              backgroundColor: palette.secondary[500],
              color: "#000",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateUser}
            style={{
              backgroundColor: palette.primary[500],
              color: "#000",
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardBox>
  );
};

export default AdminDashboard;
