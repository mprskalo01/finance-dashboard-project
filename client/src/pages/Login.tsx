import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/userHooks"; // Import the custom hook

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useUser();
  const { palette } = useTheme();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Call the handleLogin function and get the result
    const result = await handleLogin(email, password);

    if (result.success) {
      // Show success alert if login was successful
      // window.alert("Login successful!"); // Consider using a more user-friendly notification
    } else {
      // Show failure alert if login failed, with the error message
      window.alert(
        result.message || "Invalid email or password. Please try again."
      );
    }

    // Optionally clear input fields after submission
    setEmail("");
    setPassword("");
  };

  return (
    <>
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
          <Typography variant="h5">Login</Typography>
          <Box sx={{ mt: 1 }} component="form" onSubmit={onSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              style={{
                backgroundColor: palette.grey[600],
                borderRadius: "1rem",
              }}
              InputLabelProps={{
                style: { color: palette.tertiary[100], fontSize: "1rem" },
              }}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              style={{
                backgroundColor: palette.grey[600],
                borderRadius: "1rem",
              }}
              InputLabelProps={{
                style: { color: palette.tertiary[100], fontSize: "1rem" },
              }}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: palette.tertiary[500] }}
              type="submit"
            >
              Login
            </Button>
            <Grid container justifyContent={"flex-end"}>
              <Grid item>
                <Link
                  to="/register"
                  style={{
                    fontSize: "1rem",
                    backgroundColor: palette.grey[700],
                    padding: "0.25rem",
                    borderRadius: "1rem",
                    color: palette.grey[100],
                  }}
                >
                  Don't have an account? Register
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
