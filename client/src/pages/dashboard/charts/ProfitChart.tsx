import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { api } from "@/api/api";
import { useTheme, Box, IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
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
} from "recharts";
import Svgs from "@/assets/Svgs";

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

interface Account {
  monthlyData: MonthlyData[];
}

function ProfitChart() {
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
  // State to toggle between chart and bar
  const [showProfitChart, setShowProfitChart] = useState(true);

  // Handler for the button
  const handleProfitToggle = () => {
    setShowProfitChart((prev) => !prev);
  };

  const revenueExpensesProfit = useMemo(() => {
    // Check if account and monthlyData exist and have length
    if (
      account &&
      Array.isArray(account.monthlyData) &&
      account.monthlyData.length > 0
    ) {
      return account.monthlyData.map(({ month, revenue, expenses }) => ({
        name: month.substring(0, 3),
        revenue: revenue, // assuming revenue is already a number
        expenses: expenses, // assuming expenses is already a number
        profit: (revenue - expenses).toFixed(2),
      }));
    }
    return []; // Fallback to an empty array if account or monthlyData is invalid
  }, [account]);

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "-100%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  const profitPercentageChange = useMemo(() => {
    if (account && account.monthlyData?.length > 1) {
      const currentMonthRevenue =
        account.monthlyData[account.monthlyData.length - 1].revenue; // current month
      const currentMonthExpenses =
        account.monthlyData[account.monthlyData.length - 1].expenses; // current month
      const previousMonthRevenue =
        account.monthlyData[account.monthlyData.length - 2].revenue; // previous month
      const previousMonthExpenses =
        account.monthlyData[account.monthlyData.length - 2].expenses; // previous month

      const currentMonthProfit = currentMonthRevenue - currentMonthExpenses;
      const previousMonthProfit = previousMonthRevenue - previousMonthExpenses;
      return calculatePercentageChange(currentMonthProfit, previousMonthProfit);
    }
    return "N/A";
  }, [account]);
  return (
    <DashboardBox gridArea="c">
      <BoxHeader
        title={
          <Box display="flex" gap="10px" alignItems="center">
            {" "}
            {/* Added alignItems="center" */}
            <span style={{ color: palette.primary[500] }}>Profit</span>
            {/* Toggle Button */}
            <IconButton
              onClick={handleProfitToggle}
              size="small"
              sx={{
                backgroundColor: "rgba(18, 239, 200, 0.1)", // Subtle background color
                "&:hover": {
                  backgroundColor: "rgba(18, 239, 200, 0.2)", // Slightly darker on hover
                },
                borderRadius: "4px", // Optional: adjust the border radius
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
