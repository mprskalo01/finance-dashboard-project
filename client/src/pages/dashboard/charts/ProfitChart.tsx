import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useTheme, Box, IconButton } from "@mui/material";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ReferenceLine,
} from "recharts";
import Svgs from "@/assets/Svgs";
import { useAccount } from "@/context/AccountContext/UseAccount";

function ProfitChart() {
  const { palette } = useTheme();
  const { account } = useAccount();
  const [showProfitChart, setShowProfitChart] = useState(true);

  const handleProfitToggle = () => {
    setShowProfitChart((prev) => !prev);
  };

  const revenueExpensesProfit = useMemo(() => {
    if (
      account &&
      Array.isArray(account.monthlyData) &&
      account.monthlyData.length > 0
    ) {
      return account.monthlyData.map(({ month, revenue, expenses }) => ({
        name: month.substring(0, 3),
        revenue,
        expenses,
        profit: (revenue - expenses).toFixed(2),
        fill:
          revenue - expenses < 0
            ? "url(#colorProfitNegative)"
            : "url(#colorProfit)",
      }));
    }
    return [];
  }, [account]);

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "-100%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  const profitPercentageChange = useMemo(() => {
    if (account && account.monthlyData?.length > 1) {
      const currentMonthRevenue =
        account.monthlyData[account.monthlyData.length - 1].revenue;
      const currentMonthExpenses =
        account.monthlyData[account.monthlyData.length - 1].expenses;
      const previousMonthRevenue =
        account.monthlyData[account.monthlyData.length - 2].revenue;
      const previousMonthExpenses =
        account.monthlyData[account.monthlyData.length - 2].expenses;

      const currentMonthProfit = currentMonthRevenue - currentMonthExpenses;
      const previousMonthProfit = previousMonthRevenue - previousMonthExpenses;
      return calculatePercentageChange(currentMonthProfit, previousMonthProfit);
    }
    return "N/A";
  }, [account]);

  const minProfit = Math.min(
    ...revenueExpensesProfit.map((item) => parseFloat(item.profit))
  );
  const maxProfit = Math.max(
    ...revenueExpensesProfit.map((item) => parseFloat(item.profit))
  );
  const buffer = 50; // Adjust the buffer as needed

  return (
    <DashboardBox gridArea="c">
      <BoxHeader
        title={
          <Box display="flex" gap="10px" alignItems="center">
            <span style={{ color: palette.primary[500] }}>Profit</span>
            <IconButton
              onClick={handleProfitToggle}
              size="small"
              sx={{
                backgroundColor: "rgba(18, 239, 200, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(18, 239, 200, 0.2)",
                  scale: 1.1,
                },
                borderRadius: "4px",
              }}
            >
              {showProfitChart ? (
                <Svgs.barSvg strokeColor="#12efc8" />
              ) : (
                <Svgs.areaChartSvg fillColor="#12efc8" />
              )}
            </IconButton>
          </Box>
        }
        sideText={profitPercentageChange}
      />

      <ResponsiveContainer width="100%" height="100%">
        {showProfitChart ? (
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
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[400]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[400]}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient
                id="colorProfitNegative"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="red" stopOpacity={0.8} />
                <stop offset="95%" stopColor="red" stopOpacity={0} />
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
              domain={[Math.min(minProfit, 0), maxProfit + buffer]}
            />
            <Tooltip />
            <CartesianGrid
              vertical={false}
              horizontal={false}
              stroke={palette.grey[800]}
            />
            <ReferenceLine y={0} stroke="rgba(200,0,0,0.5)" />
            <Area
              type="monotone"
              dataKey="profit"
              dot={true}
              stroke={palette.primary.main}
              fillOpacity={1}
              fill="url(#colorProfit)"
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
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[500]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[400]}
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
            <Bar dataKey="profit" fill="url(#colorProfit)" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </DashboardBox>
  );
}

export default ProfitChart;
