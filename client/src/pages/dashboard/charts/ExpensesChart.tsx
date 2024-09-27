import { useState, useMemo } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import {
  AreaChart,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Bar,
  ResponsiveContainer,
} from "recharts";
import DashboardBox from "@/components/DashboardBox";
import BoxHeader from "@/components/BoxHeader";
import Svgs from "@/assets/Svgs";
import { useAccount } from "@/context/AccountContext/UseAccount";

function ExpensesChart() {
  const { palette } = useTheme();
  const { account } = useAccount();
  const [showExpensesChart, setShowExpensesChart] = useState(true);

  const revenueExpensesProfit = useMemo(() => {
    if (account?.monthlyData) {
      return account.monthlyData.map(({ month, revenue, expenses }) => ({
        name: month.substring(0, 3),
        revenue,
        expenses,
        profit: (revenue - expenses).toFixed(2),
      }));
    }
    return [];
  }, [account]);

  const handleExpensesToggle = () => {
    setShowExpensesChart((prev) => !prev);
  };
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "-100%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
  };
  const expensesPercentageChange = useMemo(() => {
    if (account && account.monthlyData?.length > 1) {
      const currentMonthExpenses =
        account.monthlyData[account.monthlyData.length - 1].expenses;
      const previousMonthExpenses =
        account.monthlyData[account.monthlyData.length - 2].expenses;

      return calculatePercentageChange(
        currentMonthExpenses,
        previousMonthExpenses
      );
    }
    return "N/A";
  }, [account]);

  return (
    <DashboardBox gridArea="b">
      <BoxHeader
        title={
          <Box display="flex" gap="10px" alignItems="center">
            <span style={{ color: palette.secondary[500] }}>Expenses</span>
            <IconButton
              onClick={handleExpensesToggle}
              size="small"
              sx={{
                backgroundColor: "rgba(242, 180, 85, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(242, 180, 85, 0.2)",
                  scale: 1.1,
                },
                borderRadius: "4px",
              }}
            >
              {showExpensesChart ? (
                <Svgs.barSvg strokeColor="#ff7300" />
              ) : (
                <Svgs.areaChartSvg fillColor="#ff7300" />
              )}
            </IconButton>
          </Box>
        }
        sideText={expensesPercentageChange}
      />
      <ResponsiveContainer width="100%" height="100%">
        {showExpensesChart ? (
          <AreaChart
            width={500}
            height={400}
            data={revenueExpensesProfit}
            margin={{
              top: 15,
              right: 25,
              left: -10,
              bottom: 60,
            }}
          >
            <defs>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.secondary[500]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.secondary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ strokeWidth: "0" }}
              style={{ fontSize: "10px" }}
              domain={["auto", "auto"]}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="expenses"
              dot={true}
              stroke={palette.secondary[500]}
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
          </AreaChart>
        ) : (
          <BarChart
            width={500}
            height={300}
            data={revenueExpensesProfit}
            margin={{
              top: 17,
              right: 15,
              left: -5,
              bottom: 58,
            }}
          >
            <defs>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.secondary[500]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.secondary[400]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Bar dataKey="expenses" fill="url(#colorExpenses)" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </DashboardBox>
  );
}

export default ExpensesChart;
