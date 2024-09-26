import { useState, useEffect } from "react";
import { HashLoader } from "react-spinners";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import api from "@/api/api";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

interface Account {
  monthlyData: MonthlyData[];
}

const Row2 = () => {
  const { palette } = useTheme();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [currentMonthProfit, setCurrentMonthProfit] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);

  useEffect(() => {
    const fetchUserAccount = async () => {
      try {
        const response = await api.getUserAccount();
        setAccount(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserAccount();
  }, []); // Fetch account data on component mount

  useEffect(() => {
    if (account && account.monthlyData.length > 0) {
      const currentMonthName = new Date()
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      const currentMonthData = account.monthlyData.find(
        (data) => data.month.toLowerCase() === currentMonthName
      );

      if (currentMonthData) {
        setCurrentMonthRevenue(currentMonthData.revenue);
        setCurrentMonthExpenses(currentMonthData.expenses);
        setCurrentMonthProfit(
          currentMonthData.revenue - currentMonthData.expenses
        );
      }
      setLoading(false);
    } else {
      setLoading(false); // Ensure loading is false if there's no data
    }
  }, [account]);

  return (
    <>
      <DashboardBox gridArea="e">
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <HashLoader color="#4f46e5" size={100} />
            <Typography
              variant="h2"
              fontWeight="bold"
              style={{ color: "#4f46e5" }}
            >
              Loading...
            </Typography>
          </Box>
        ) : (
          <>
            <BoxHeader
              title="Current Month Performance"
              sideText={`${new Date().toLocaleString("default", {
                month: "long",
              })} ${new Date().getFullYear()}`}
            />
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <FlexBetween
                sx={{
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  justifyContent: "spaceBetween",
                }}
              >
                {[
                  {
                    label: "Revenue",
                    value: currentMonthRevenue.toLocaleString(),
                    color: palette.tertiary[500],
                  },
                  {
                    label: "Expenses",
                    value: currentMonthExpenses.toLocaleString(),
                    color: palette.secondary[500],
                  },
                  {
                    label: "Profit",
                    value: currentMonthProfit.toLocaleString(),
                    color: palette.primary[500],
                  },
                ].map(({ label, value, color }, index) => (
                  <Box
                    key={index}
                    textAlign="center"
                    sx={{ flex: "1 1 30%", minWidth: "150px" }}
                  >
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color={color}
                      sx={{
                        fontSize: { xs: "1.5rem", md: "1rem", xl: "1.25rem" },
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="h4"
                      color={color}
                      mt={1}
                      sx={{
                        fontSize: { xs: "1.5rem", md: "1rem", xl: "1.25rem" },
                      }}
                    >
                      ${value}
                    </Typography>
                  </Box>
                ))}
              </FlexBetween>
            </Box>
          </>
        )}
      </DashboardBox>
      <DashboardBox gridArea="f">
        <BoxHeader
          title="Recent Transactions"
          // sideText={`${transactionData?.length} latest transactions`}
          sideText={"0"}
        />
      </DashboardBox>
    </>
  );
};

export default Row2;
