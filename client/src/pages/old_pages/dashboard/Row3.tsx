import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useMemo, useState } from "react";
import {
  useGetKpisQuery,
  // useGetProductsQuery,
  useGetTransactionsQuery,
} from "@/api/api";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
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

const Row3 = () => {
  const { palette } = useTheme();
  const { data } = useGetKpisQuery();

  const revenueExpensesProfit = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
          expenses: expenses,
          profit: (revenue - expenses).toFixed(2),
        };
      })
    );
  }, [data]);

  const { data: kpiData } = useGetKpisQuery();
  const { data: transactionData } = useGetTransactionsQuery();

  // Calculate the expenses change
  const currentExpenses = kpiData?.[0]?.totalExpenses || 0;
  const previousExpenses = kpiData?.[1]?.totalExpenses || 0;
  const expensesChange = currentExpenses - previousExpenses;
  const expensesChangePercentage =
    previousExpenses !== 0
      ? ((expensesChange / previousExpenses) * 100).toFixed(2)
      : "N/A";

  // Calculate the revenue change
  const currentRevenue = kpiData?.[0]?.totalRevenue || 0;
  const previousRevenue = kpiData?.[1]?.totalRevenue || 0;
  const revenueChange = currentRevenue - previousRevenue;
  const revenueChangePercentage =
    previousRevenue !== 0
      ? ((revenueChange / previousRevenue) * 100).toFixed(2)
      : "N/A";

  // Generate a summary
  const generateSummary = () => {
    // if (!kpiData || kpiData.length < 2) return "Insufficient data for summary.";

    const profitMargin = (
      ((currentRevenue - currentExpenses) / currentRevenue) *
      100
    ).toFixed(2);
    const previousProfitMargin =
      previousRevenue !== 0
        ? (
            ((previousRevenue - previousExpenses) / previousRevenue) *
            100
          ).toFixed(2)
        : "N/A";

    return `Current revenue: $${currentRevenue.toFixed(
      2
    )}, expenses: $${currentExpenses.toFixed(2)}.
    Revenue ${revenueChange >= 0 ? "increased" : "decreased"} by $${Math.abs(
      revenueChange
    ).toFixed(2)} (${revenueChangePercentage}%).
    Expenses ${expensesChange >= 0 ? "increased" : "decreased"} by $${Math.abs(
      expensesChange
    ).toFixed(2)} (${expensesChangePercentage}%).
    Current profit margin: ${profitMargin}% (previously ${previousProfitMargin}%).`;
  };

  // const productColumns = [
  //   // {
  //   //   field: "_id",
  //   //   headerName: "id",
  //   //   flex: 0.6,
  //   // },
  //   {
  //     field: "name",
  //     headerName: "Product Name",
  //     flex: 0.8,
  //   },
  //   {
  //     field: "expense",
  //     headerName: "Expense",
  //     flex: 0.4,
  //     renderCell: (params: GridCellParams) => `$${params.value}`,
  //   },
  //   {
  //     field: "price",
  //     headerName: "Price",
  //     flex: 0.5,
  //     renderCell: (params: GridCellParams) => `$${params.value}`,
  //   },
  // ];
  const transactionColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 0.67,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.35,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.1,
      renderCell: (params: GridCellParams) =>
        (params.value as Array<string>).length,
    },
  ];
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
          sideText="hlelo"
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
        <BoxHeader
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
        </Typography>
      </DashboardBox>
    </>
  );
};

export default Row3;
