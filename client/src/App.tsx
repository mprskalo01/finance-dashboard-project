import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "@/components/navbar";
// import Dashboard from "@/pages/dashboard";
// import Predictions from "@/pages/predictions";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { AuthProvider } from "@/context/AuthProvider"; // Import AuthProvider
import ProtectedRoute from "@/components/ProtectedRoute";
import AccountInfo from "@/pages/AccountInfo";

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);

  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          {" "}
          {/* Wrap the application with AuthProvider */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
              <Navbar />
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<AccountInfo />} />}
                />
                {/* <Route
                  path="/predictions"
                  element={<ProtectedRoute element={<Predictions />} />}
                /> */}
              </Routes>
            </Box>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
