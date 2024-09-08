// import React from "react";

import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import React from "react";

type Props = {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  sideText: string;
};

const BoxHeader = ({ icon, title, subtitle, sideText }: Props) => {
  const { palette } = useTheme();
  return (
    <FlexBetween color={palette.grey[400]} margin="1.5rem 1rem 0 1rem">
      <FlexBetween>
        {icon}
        <Box width="100%">
          <Typography variant="h4" mb="-0.1rem">
            {title}
          </Typography>
          <Typography variant="h6" mb="-0.1rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <Typography
        variant="h5"
        fontWeight="700"
        color={
          sideText.startsWith("-")
            ? "#df1b1b"
            : sideText.startsWith("+")
            ? palette.primary[500]
            : palette.tertiary[500]
        }
      >
        {sideText}
      </Typography>
    </FlexBetween>
  );
};

export default BoxHeader;
