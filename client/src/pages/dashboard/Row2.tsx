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
  }, []); // Add dependency array to avoid infinite loop

  const [loading, setLoading] = useState(true);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [currentMonthProfit, setCurrentMonthProfit] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);

  useEffect(() => {
    if (account && account?.monthlyData.length > 0) {
      const currentMonthName = new Date()
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      const currentMonthData = account?.monthlyData.find(
        (account) => account.month.toLowerCase() === currentMonthName
      );

      if (currentMonthData) {
        setCurrentMonthRevenue(currentMonthData.revenue);
        setCurrentMonthExpenses(currentMonthData.expenses);
        setCurrentMonthProfit(
          currentMonthData.revenue - currentMonthData.expenses
        );
      } else {
        setCurrentMonthRevenue(0);
        setCurrentMonthExpenses(0);
        setCurrentMonthProfit(0);
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
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <div>
              <HashLoader color="#4f46e5" size={100} />
              <Typography
                variant="h2"
                fontWeight="bold"
                style={{ color: "#4f46e5" }}
              >
                Loading...
              </Typography>
            </div>
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
              height="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <FlexBetween sx={{ gap: "1.5rem" }}>
                <div>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={palette.tertiary[500]}
                    sx={{
                      fontSize: {
                        xs: "1.5rem",
                        sm: "1.5rem",
                        md: "1rem",
                        xl: "1.25rem",
                      },
                    }}
                  >
                    Revenue
                  </Typography>
                  <Typography
                    variant="h4"
                    color={palette.tertiary[500]}
                    mt={2}
                    sx={{
                      marginBottom: "4rem",
                      fontSize: {
                        xs: "1.5rem",
                        sm: "1.5rem",
                        md: "1rem",
                        xl: "1.25rem",
                      },
                    }}
                  >
                    ${currentMonthRevenue.toLocaleString()}
                  </Typography>
                </div>

                <div>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={palette.secondary[500]}
                    sx={{
                      fontSize: {
                        xs: "1.5rem",
                        sm: "1.5rem",
                        md: "1rem",
                        xl: "1.25rem",
                      },
                    }}
                  >
                    Expenses
                  </Typography>
                  <Typography
                    variant="h4"
                    color={palette.secondary[500]}
                    mt={2}
                    sx={{
                      marginBottom: "4rem",
                      fontSize: {
                        xs: "1.5rem",
                        sm: "1.5rem",
                        md: "1rem",
                        xl: "1.25rem",
                      },
                    }}
                  >
                    ${currentMonthExpenses.toLocaleString()}
                  </Typography>
                </div>

                <div>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={palette.primary[500]}
                    sx={{
                      fontSize: {
                        xs: "1.5rem",
                        sm: "1.5rem",
                        md: "1rem",
                        xl: "1.25rem",
                      },
                    }}
                  >
                    Profit
                  </Typography>
                  <Typography
                    variant="h4"
                    color={palette.primary[300]}
                    mt={2}
                    sx={{
                      marginBottom: "4rem",
                      fontSize: {
                        xs: "1.5rem",
                        sm: "1.5rem",
                        md: "1rem",
                        xl: "1.25rem",
                      },
                    }}
                  >
                    ${currentMonthProfit.toLocaleString()}
                  </Typography>
                </div>
              </FlexBetween>
            </Box>
          </>
        )}
      </DashboardBox>
      <DashboardBox gridArea="f">
        <Typography
          variant="h3"
          fontWeight="bold"
          color={palette.secondary[300]}
          sx={{ my: "1rem" }}
        >
          // todo : here will be date list for transactions
        </Typography>
      </DashboardBox>
    </>
  );
};

export default Row2;
