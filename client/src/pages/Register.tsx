import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/userHooks"; // Import the custom hook

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const { palette } = useTheme();

  const { handleRegister } = useUser(); // Destructure the handleRegister function from useUser

  const clearForm = () => {
    setUsername("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword(""); // Clear confirm password field
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      clearForm();
      return;
    }
    // Call the handleRegister function from the custom hook
    handleRegister(username, name, email, password);
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          mt: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: palette.tertiary[500] }}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">Register</Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                required
                fullWidth
                id="username"
                type="text"
                label="Username"
                value={username}
                style={{
                  backgroundColor: palette.grey[600],
                  borderRadius: "1rem",
                }}
                onChange={(e) => setUsername(e.target.value)}
                InputLabelProps={{
                  style: { color: palette.grey[100], fontSize: "1rem" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                type="text"
                label="Name"
                value={name}
                style={{
                  backgroundColor: palette.grey[600],
                  borderRadius: "1rem",
                }}
                onChange={(e) => setName(e.target.value)}
                InputLabelProps={{
                  style: { color: palette.tertiary[100], fontSize: "1rem" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                name="email"
                value={email}
                style={{
                  backgroundColor: palette.grey[600],
                  borderRadius: "1rem",
                }}
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{
                  style: { color: palette.tertiary[100], fontSize: "1rem" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                style={{
                  backgroundColor: palette.grey[600],
                  borderRadius: "1rem",
                }}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{
                  style: { color: palette.tertiary[100], fontSize: "1rem" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                style={{
                  backgroundColor: palette.grey[600],
                  borderRadius: "1rem",
                }}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputLabelProps={{
                  style: { color: palette.tertiary[100], fontSize: "1rem" },
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: palette.tertiary[500] }}
          >
            Register
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                to="/login"
                style={{
                  fontSize: "1rem",
                  backgroundColor: palette.grey[700],
                  padding: "0.25rem",
                  borderRadius: "1rem",
                  color: palette.grey[100],
                }}
              >
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
