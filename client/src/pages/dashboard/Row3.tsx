import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
// import FlexBetween from "@/components/FlexBetween";
import {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
} from "@/state/api";
import { Box, Typography, useTheme, Tooltip } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const Row3 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.secondary[800], palette.secondary[500]];

  const { data: kpiData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();
  const { data: transactionData } = useGetTransactionsQuery();

  const pieChartData = useMemo(() => {
    if (kpiData) {
      const totalExpenses = kpiData[0].totalExpenses;
      return Object.entries(kpiData[0].expensesByCategory).map(
        ([key, value]) => {
          return [
            {
              name: key,
              value: value,
            },
            {
              name: `${key} of Total`,
              value: totalExpenses - value,
            },
          ];
        }
      );
    }
  }, [kpiData]);

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

  const productColumns = [
    // {
    //   field: "_id",
    //   headerName: "id",
    //   flex: 0.6,
    // },
    {
      field: "name",
      headerName: "Product Name",
      flex: 0.8,
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.4,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
  ];

  const transactionColumns = [
    // {
    //   field: "_id",
    //   headerName: "id",
    //   flex: 1,
    // },
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.3,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.2,
      renderCell: (params: GridCellParams) =>
        (params.value as Array<string>).length,
    },
  ];

  return (
    <>
      <DashboardBox gridArea="g">
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
            rows={productData || []}
            columns={productColumns}
          />
        </Box>
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
          title="Expense Breakdown By Category"
          sideText={`${expensesChangePercentage}%`}
        />
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-around"
          alignItems="center"
          mt="0.5rem"
          gap="0.5rem"
          p="0 0.5rem"
        >
          {pieChartData?.slice(0, 3).map((data, i) => (
            <Box key={`${data[0].name}-${i}`} width="30%" minWidth="100px">
              <Tooltip
                title={`${data[0].name}: $${data[0].value.toFixed(2)}`}
                arrow
                placement="top"
              >
                <Box>
                  <ResponsiveContainer width="100%" height={80}>
                    <PieChart>
                      <Pie
                        stroke="none"
                        data={data}
                        innerRadius={18}
                        outerRadius={35}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {data.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <Typography variant="h4" textAlign="center">
                    {data[0].name}
                    {` $${data[0].value}`}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
          ))}
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="j">
        <BoxHeader
          title="Overall Summary & Explanation Data"
          sideText={`${revenueChangePercentage}%`}
        />
        <Tooltip
          title={`Revenue: $${currentRevenue.toFixed(
            2
          )}, Expenses: $${currentExpenses.toFixed(2)}`}
          arrow
          placement="top"
        >
          <Box
            height="15px"
            margin="1.25rem 1rem 0.4rem 1rem"
            bgcolor={palette.primary[800]}
            borderRadius="1rem"
          >
            <Box
              height="15px"
              bgcolor={palette.primary[600]}
              borderRadius="1rem"
              width={`${
                (currentRevenue / (currentRevenue + currentExpenses)) * 100
              }%`}
            ></Box>
          </Box>
        </Tooltip>
        <Typography margin="0 1rem" variant="h6">
          {generateSummary()}
        </Typography>
      </DashboardBox>
    </>
  );
};

export default Row3;
