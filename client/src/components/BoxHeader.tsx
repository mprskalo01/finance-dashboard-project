import { Box, Typography, Tooltip, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import React from "react";

type Props = {
  title: string | React.ReactNode;
  icon?: React.ReactNode;
  subtitle?: string;
  sideText: string | React.ReactNode; // Adjusted type
};

const BoxHeader = ({ icon, title, subtitle, sideText }: Props) => {
  const { palette } = useTheme();

  // Type guard to check if sideText is a string
  const isString = (text: string | React.ReactNode): text is string =>
    typeof text === "string";

  // Determine if tooltip should be shown
  const shouldShowTooltip =
    isString(sideText) &&
    (sideText.startsWith("+") ||
      sideText.startsWith("-") ||
      sideText.startsWith("Op:") ||
      sideText.startsWith("N/A"));

  // Determine the tooltip message
  const tooltipMessage =
    isString(sideText) && sideText.startsWith("N/A")
      ? "No last year's data found"
      : "Comparing monthly values";

  return (
    <FlexBetween color={palette.grey[400]} margin="0.5rem 1rem 0 1rem">
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
      {shouldShowTooltip ? (
        <Tooltip title={tooltipMessage}>
          <Typography
            variant="h5"
            fontWeight="700"
            color={
              isString(sideText)
                ? sideText.startsWith("-")
                  ? "#df1b1b"
                  : sideText.startsWith("+")
                  ? palette.primary[500]
                  : palette.tertiary[500]
                : palette.tertiary[500] // Default color if sideText is not a string
            }
          >
            {sideText}
          </Typography>
        </Tooltip>
      ) : (
        <Typography
          variant="h5"
          fontWeight="700"
          color={
            isString(sideText)
              ? sideText.startsWith("-")
                ? "#df1b1b"
                : sideText.startsWith("+")
                ? palette.primary[500]
                : palette.tertiary[500]
              : palette.tertiary[500] // Default color if sideText is not a string
          }
        >
          {sideText}
        </Typography>
      )}
    </FlexBetween>
  );
};

export default BoxHeader;
