import { useState } from "react";
import PixIcon from "@mui/icons-material/Pix";
import { NavLink } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";

// type Props = {}; input {}: Props into Navbar( here ) if props

function Navbar() {
  const { palette } = useTheme();
  const setSelected = useState("dashboard")[1];
  return (
    <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
      {/* LEFT SIDE */}
      <FlexBetween gap="0.75rem">
        <NavLink
          to="/dashboard"
          onClick={() => setSelected("dashboard")}
          style={({ isActive }) => ({
            color: isActive ? "inherit" : palette.grey[700],
            textDecoration: "inherit",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          })}
        >
          <PixIcon sx={{ fontSize: "28px" }} />
          <Typography variant="h4" fontSize="16">
            FAInance
          </Typography>
        </NavLink>
      </FlexBetween>
      {/* RIGHT SIDE */}
      <FlexBetween gap="2rem">
        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <NavLink
            to="/dashboard"
            onClick={() => setSelected("dashboard")}
            style={({ isActive }) => ({
              color: isActive ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            })}
          >
            dashboard
          </NavLink>
        </Box>
        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <NavLink
            to="/predictions"
            onClick={() => setSelected("predictions")}
            style={({ isActive }) => ({
              color: isActive ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            })}
          >
            predictions
          </NavLink>
        </Box>
      </FlexBetween>
    </FlexBetween>
  );
}

export default Navbar;
