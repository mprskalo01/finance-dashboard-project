import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useMemo, useState, useEffect } from "react";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";
import { Box, Typography, useTheme, IconButton, Button } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
import {
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import Svgs from "@/assets/Svgs";
import { useUser } from "@/hooks/userHooks"; // Import the custom hook

interface User {
  username: string;
  // Add any other fields you want to display from the user profile
}

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

const Row3 = () => {
  const { palette } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const { handleLogout } = useUser();
  const navigate = useNavigate();
  // const [error, setError] = useState<string | null>(null);

  const buttonClick = () => {
    handleLogout(); // Perform logout
    navigate("/login"); // Redirect to login page
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.getUserProfile();
        setUser(response.data); // Assuming response contains the user object
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUserAccount = async () => {
      try {
        const response = await api.getUserAccount();
        setAccount(response.data); // Assuming response contains the account object
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserProfile();
    fetchUserAccount();
  }, []);

  const revenueExpensesProfit = useMemo(() => {
    return (
      account?.monthlyData.map(({ month, revenue, expenses }) => ({
        name: month.substring(0, 3),
        revenue,
        expenses,
        profit: (revenue - expenses).toFixed(2),
      })) || [] // Fallback to an empty array if account is null
    );
  }, [account]);

  // Calculate the expenses change
  const currentExpenses = account?.monthlyData?.[0]?.expenses || 0;
  const previousExpenses = account?.monthlyData?.[1]?.expenses || 0;
  const expensesChange = currentExpenses - previousExpenses;
  const expensesChangePercentage =
    previousExpenses !== 0
      ? ((expensesChange / previousExpenses) * 100).toFixed(2)
      : "N/A";

  // Calculate the revenue change
  const currentRevenue = account?.monthlyData?.[0]?.revenue || 0;
  const previousRevenue = account?.monthlyData?.[1]?.revenue || 0;
  const revenueChange = currentRevenue - previousRevenue;
  const revenueChangePercentage =
    previousRevenue !== 0
      ? ((revenueChange / previousRevenue) * 100).toFixed(2)
      : "N/A";

  const [showChart, setShowChart] = useState(true);

  // Handler for the button
  const handleChartToggle = () => {
    setShowChart((prev) => !prev);
  };

  return (
    <>
      <DashboardBox gridArea="d">
        <BoxHeader
          title={
            <Box display="flex" gap="10px" alignItems="center">
              {" "}
              {/* Added alignItems="center" */}
              <div>
                <span style={{ color: palette.tertiary[500] }}>Revenue</span>,{" "}
                <span style={{ color: palette.secondary[500] }}>Expenses</span>,{" "}
                {"& "}
                <span style={{ color: palette.primary[500] }}>Profit</span>
              </div>
              {/* Toggle Button */}
              <IconButton
                onClick={handleChartToggle}
                size="small"
                sx={{
                  backgroundColor: "rgba(131, 183, 166, 0.1)", // Subtle background color
                  "&:hover": {
                    backgroundColor: "rgba(131, 183, 166, 0.2)", // Slightly darker on hover
                  },
                  borderRadius: "4px", // Optional: adjust the border radius
                }}
              >
                {showChart ? (
                  <Svgs.barSvg strokeColor="#83b7a6" />
                ) : (
                  <Svgs.areaChartSvg fillColor="#83b7a6" />
                )}
              </IconButton>
            </Box>
          }
          sideText={`${revenueChangePercentage} & ${expensesChangePercentage}`}
        />
        <ResponsiveContainer width="100%" height="80%">
          {showChart ? (
            <AreaChart
              width={500}
              height={400}
              data={revenueExpensesProfit}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.tertiary[500]}
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.tertiary[300]}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.secondary[300]}
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.secondary[300]}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.primary[500]}
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.primary[400]}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="1 2" />
              <XAxis dataKey="name" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="profit"
                stackId="1"
                dot={true}
                stroke={palette.primary[500]}
                fill="url(#colorProfit)"
              />

              <Area
                type="monotone"
                dataKey="expenses"
                stackId="1"
                dot={true}
                stroke={palette.secondary[500]}
                fill="url(#colorExpenses)"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                dot={true}
                stroke={palette.tertiary[500]}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          ) : (
            <BarChart
              width={500}
              height={300}
              data={revenueExpensesProfit}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.tertiary[500]} // Start color (no opacity)
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.tertiary[400]} // End color (no opacity)
                  />
                </linearGradient>

                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.secondary[500]} // Start color (no opacity)
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.secondary[400]} // End color (no opacity)
                  />
                </linearGradient>

                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.primary[500]} // Start color (no opacity)
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.primary[400]} // End color (no opacity)
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" stackId="a" fill="url(#colorRevenue)" />
              <Bar dataKey="expenses" stackId="b" fill="url(#colorExpenses)" />
              <Bar dataKey="profit" stackId="c" fill="url(#colorProfit)" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="h">
        <Typography
          variant="h3"
          fontWeight="bold"
          color={palette.secondary[300]}
          sx={{ my: "1rem" }}
        >
          // todo : add CRUD for months and user stats
          <br />
          // todo : add user profile popup to change info
          <br />
          // todo : change the revenue expense & profit to show something more
          useful
          <br />
          // todo : CRUD for transactions
          <br />
          // todo : add view transactions by date
        </Typography>
        {/* <BoxHeader
          title="Recent Orders"
          sideText={`${transactionData?.length} latest transactions`}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={transactionData || []}
            columns={transactionColumns}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="i">
        <BoxHeader
          title="Overall Summary & Explanation Data"
          sideText={`${revenueChangePercentage}%`}
        />
        <Typography margin="0 1rem" variant="h6">
          {generateSummary()}
        </Typography> */}
      </DashboardBox>
      <DashboardBox
        gridArea="i"
        sx={{
          p: 2,
        }}
      >
        <Typography variant="h2" fontWeight="bold" color={palette.grey[200]}>
          Welcome, {user?.username}!
        </Typography>
        <Box mt={2}>
          <Typography variant="h3" color={palette.grey[300]}>
            Your current account balance is:{" "}
            <Typography
              variant="h2"
              component="span"
              fontWeight="bold"
              color={palette.primary[500]}
            >
              ${account?.currentBalance.toFixed(2)}
            </Typography>
          </Typography>
          <Typography variant="h3" color={palette.grey[300]}>
            Your total revenue is:{" "}
            <Typography
              variant="h3"
              component="span"
              fontWeight="bold"
              color={palette.tertiary[500]}
            >
              ${account?.totalRevenue.toFixed(2)}
            </Typography>
          </Typography>
          <Typography variant="h3" color={palette.grey[300]}>
            Your total expenses are:{" "}
            <Typography
              variant="h3"
              component="span"
              fontWeight="bold"
              color={palette.secondary[500]}
            >
              ${account?.totalExpenses.toFixed(2)}
            </Typography>
          </Typography>
        </Box>
        <Typography
          variant="h3"
          fontWeight="bold"
          color={palette.secondary[300]}
          sx={{ my: "1rem" }}
        >
          {/* Logout Button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={buttonClick}
            sx={{ mt: 2 }} // Add some margin for layout
          >
            Logout
          </Button>
        </Typography>
      </DashboardBox>
    </>
  );
};

export default Row3;
