import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Predictions from "@/pages/predictions";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { AuthProvider } from "@/context/AuthProvider"; // Import AuthProvider
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
// import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
// import { AdminProvider } from "@/context/AdminProvider";

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);

  return (
    <div className="app">
      <BrowserRouter>
        {/* <AdminProvider> */}
        <AuthProvider>
          {" "}
          {/* Wrap the application with AuthProvider */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<Dashboard />} />}
                />
                <Route
                  path="/predictions"
                  element={<ProtectedRoute element={<Predictions />} />}
                />
                <Route path="/admin" element=<AdminDashboard /> />
              </Routes>
            </Box>
          </ThemeProvider>
        </AuthProvider>
        {/* </AdminProvider> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
