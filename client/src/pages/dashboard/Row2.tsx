import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { HashLoader } from "react-spinners";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";
import TransactionList from "./lists/TransactionList";
import { AccountContext } from "@/context/AccountContext/AccountContext";

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

interface Account {
  monthlyData: MonthlyData[];
  currentBalance: number;
  totalRevenue: number;
  totalExpenses: number;
}

const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};

const Row2 = () => {
  const { palette } = useTheme();
  const { account, fetchUserAccount } = useAccount();

  const [loading, setLoading] = useState(true);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [currentMonthProfit, setCurrentMonthProfit] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);

  const updateCurrentMonthData = useCallback((accountData: Account) => {
    const currentMonthName = new Date()
      .toLocaleString("default", { month: "long" })
      .toLowerCase();
    const currentMonthData = accountData.monthlyData.find(
      (data) => data.month.toLowerCase() === currentMonthName
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
  }, []);

  const initialFetch = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchUserAccount();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (initialFetch.current) {
      fetchData();
      initialFetch.current = false;
    }
  }, [fetchUserAccount]);

  useEffect(() => {
    if (account) {
      updateCurrentMonthData(account);
    }
  }, [account, updateCurrentMonthData]);

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
                        xs: "1rem",
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
                        xs: "1rem",
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
                        xs: "1rem",
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
                        xs: "1rem",
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
                        xs: "1rem",
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
                        xs: "1rem",
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
      <TransactionList />
    </>
  );
};

export default Row2;
