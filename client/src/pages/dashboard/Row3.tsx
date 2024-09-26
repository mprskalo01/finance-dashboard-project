import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useMemo, useState, useEffect } from "react";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";
import { Box, Typography, useTheme, IconButton, Button } from "@mui/material";
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
import { DataGrid, GridCellParams } from "@mui/x-data-grid";

interface User {
  username: string;
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

interface Product {
  name: string;
  price: number;
  expense: number;
}

const Row3 = () => {
  const { palette } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [productData, setProductData] = useState<Product[]>([]);
  const { handleLogout } = useUser();
  const navigate = useNavigate();

  const buttonClick = () => {
    handleLogout(); // Perform logout
    navigate("/login"); // Redirect to login page
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.getUserProfile();
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUserAccount = async () => {
      try {
        const response = await api.getUserAccount();
        setAccount(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserProfile();
    fetchUserAccount();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.getAllProducts(); // Fetch products
        setProductData(response.data); // Set the fetched products to state
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // const productColumns = [
  //   // { field: "id", headerName: "ID", width: 90 },
  //   { field: "name", headerName: "Name", flex: 1 },
  //   { field: "price", headerName: "Price", width: 120 },
  //   { field: "expense", headerName: "Expense", width: 120 },
  //   // Add more columns as needed based on your Product model
  // ];

  const revenueExpensesProfit = useMemo(() => {
    return (
      account?.monthlyData.map(({ month, revenue, expenses }) => ({
        name: month.substring(0, 3),
        revenue,
        expenses,
        profit: (revenue - expenses).toFixed(2),
      })) || []
    );
  }, [account]);

  const [showChart, setShowChart] = useState(true);

  // Handler for the button
  const handleChartToggle = () => {
    setShowChart((prev) => !prev);
  };

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

  // New handler for editing monthly values
  const handleEditMonthlyValues = () => {
    // Implement your editing logic here, e.g., open a modal or navigate to an edit page
    console.log("Edit monthly values");
    // You might want to open a form/modal to handle the CRUD operations
  };

  const productColumns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
  ];

  return (
    <>
      <DashboardBox gridArea="d">
        <BoxHeader
          title={
            <Box display="flex" gap="10px" alignItems="center">
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
                  backgroundColor: "rgba(131, 183, 166, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(131, 183, 166, 0.2)",
                  },
                  borderRadius: "4px",
                }}
              >
                {showChart ? (
                  <Svgs.barSvg strokeColor="#83b7a6" />
                ) : (
                  <Svgs.areaChartSvg fillColor="#83b7a6" />
                )}
              </IconButton>
              {/* Edit Button */}
              <IconButton
                onClick={handleEditMonthlyValues}
                size="small"
                sx={{
                  backgroundColor: "rgba(255, 206, 86, 0.1)", // Example background color
                  "&:hover": {
                    backgroundColor: "rgba(255, 206, 86, 0.2)", // Darker on hover
                  },
                  borderRadius: "4px",
                }}
              >
                <Svgs.editSvg fillColor="#0ea5e9" />{" "}
                {/* Ensure to have an edit SVG icon */}
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
                  <stop offset="5%" stopColor={palette.tertiary[500]} />
                  <stop offset="95%" stopColor={palette.tertiary[400]} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={palette.secondary[500]} />
                  <stop offset="95%" stopColor={palette.secondary[400]} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={palette.primary[500]} />
                  <stop offset="95%" stopColor={palette.primary[400]} />
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
        <BoxHeader
          title="List of Products"
          sideText={`${productData?.length} products`}
        />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
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
            rows={productData} // Use the fetched product data
            columns={productColumns} // Pass the defined columns
          />
        </Box>
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
