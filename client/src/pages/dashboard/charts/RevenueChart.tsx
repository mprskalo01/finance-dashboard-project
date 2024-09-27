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

function RevenueChart() {
  const { palette } = useTheme();
  const { account } = useAccount();
  const [showRevenueChart, setShowRevenueChart] = useState(true);

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

  const handleRevenueToggle = () => {
    setShowRevenueChart((prev) => !prev);
  };
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "-100%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
  };
  const revenuePercentageChange = useMemo(() => {
    if (account && account.monthlyData?.length > 1) {
      const currentMonthRevenue =
        account.monthlyData[account.monthlyData.length - 1].revenue;
      const previousMonthRevenue =
        account.monthlyData[account.monthlyData.length - 2].revenue;

      return calculatePercentageChange(
        currentMonthRevenue,
        previousMonthRevenue
      );
    }
    return "N/A";
  }, [account]);

  return (
    <DashboardBox gridArea="a">
      <BoxHeader
        title={
          <Box display="flex" gap="10px" alignItems="center">
            <span style={{ color: palette.tertiary[500] }}>Revenue</span>
            <IconButton
              onClick={handleRevenueToggle}
              size="small"
              sx={{
                backgroundColor: "rgba(136, 132, 216, 0.2)",
                "&:hover": {
                  backgroundColor: "rgba(136, 132, 216, 0.3)",
                  scale: 1.1,
                },
                borderRadius: "4px",
              }}
            >
              {showRevenueChart ? (
                <Svgs.barSvg strokeColor="#8884d8" />
              ) : (
                <Svgs.areaChartSvg fillColor="#8884d8" />
              )}
            </IconButton>
          </Box>
        }
        sideText={revenuePercentageChange}
      />
      <ResponsiveContainer width="100%" height="100%">
        {showRevenueChart ? (
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
              dataKey="revenue"
              dot={true}
              stroke={palette.tertiary[500]}
              fillOpacity={1}
              fill="url(#colorRevenue)"
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
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.tertiary[500]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.tertiary[400]}
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
            <Bar dataKey="revenue" fill="url(#colorRevenue)" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </DashboardBox>
  );
}

export default RevenueChart;
