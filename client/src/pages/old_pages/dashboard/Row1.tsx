import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
// import FlexBetween from "@/components/FlexBetween";
import { useGetAccountsQuery } from "@/api/api";
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
} from "recharts";
import Svgs from "@/assets/Svgs";

const Row1 = () => {
  const { palette } = useTheme();
  const { data } = useGetAccountsQuery();
  // State to toggle between chart and bar
  const [showRevenueChart, setShowRevenueChart] = useState(true);
  const [showExpensesChart, setShowExpensesChart] = useState(true);
  const [showProfitChart, setShowProfitChart] = useState(true);

  // Handler for the button
  const handleRevenueToggle = () => {
    setShowRevenueChart((prev) => !prev);
  };
  const handleExpensesToggle = () => {
    setShowExpensesChart((prev) => !prev);
  };
  const handleProfitToggle = () => {
    setShowProfitChart((prev) => !prev);
  };

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

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "-100%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  const revenuePercentageChange = useMemo(() => {
    if (data) {
      const currentMonthRevenue =
        data[0].monthlyData[data[0].monthlyData.length - 1].revenue; // current month (last in the array)
      const previousMonthRevenue =
        data[0].monthlyData[data[0].monthlyData.length - 2].revenue; // previous month

      return calculatePercentageChange(
        currentMonthRevenue,
        previousMonthRevenue
      );
    }
    return "N/A";
  }, [data]);

  const expensesPercentageChange = useMemo(() => {
    if (data) {
      const currentMonthExpenses =
        data[0].monthlyData[data[0].monthlyData.length - 1].expenses; // current month (last in the array)
      const previousMonthExpenses =
        data[0].monthlyData[data[0].monthlyData.length - 2].expenses; // previous month

      return calculatePercentageChange(
        currentMonthExpenses,
        previousMonthExpenses
      );
    }
    return "N/A";
  }, [data]);

  const profitPercentageChange = useMemo(() => {
    if (data) {
      const currentMonthRevenue =
        data[0].monthlyData[data[0].monthlyData.length - 1].revenue;
      const currentMonthExpenses =
        data[0].monthlyData[data[0].monthlyData.length - 1].expenses;
      const previousMonthRevenue =
        data[0].monthlyData[data[0].monthlyData.length - 2].revenue;
      const previousMonthExpenses =
        data[0].monthlyData[data[0].monthlyData.length - 2].expenses;

      const currentMonthProfit = currentMonthRevenue - currentMonthExpenses;
      const previousMonthProfit = previousMonthRevenue - previousMonthExpenses;
      return calculatePercentageChange(currentMonthProfit, previousMonthProfit);
    }
    return "N/A";
  }, [data]);

  return (
    <>
      <DashboardBox gridArea="a">
        <BoxHeader
          title={
            <Box display="flex" gap="10px" alignItems="center">
              {" "}
              {/* Added alignItems="center" */}
              <span style={{ color: palette.tertiary[500] }}>Revenue</span>
              {/* Toggle Button */}
              <IconButton
                onClick={handleRevenueToggle}
                size="small"
                sx={{
                  backgroundColor: "rgba(136, 132, 216, 0.1)", // Subtle background color
                  "&:hover": {
                    backgroundColor: "rgba(136, 132, 216, 0.2)", // Slightly darker on hover
                  },
                  borderRadius: "4px", // Optional: adjust the border radius
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
          // subtitle=""
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
      <DashboardBox gridArea="b">
        <BoxHeader
          title={
            <Box display="flex" gap="10px" alignItems="center">
              {" "}
              {/* Added alignItems="center" */}
              <span style={{ color: palette.secondary[500] }}>Expenses</span>
              {/* Toggle Button */}
              <IconButton
                onClick={handleExpensesToggle}
                size="small"
                sx={{
                  backgroundColor: "rgba(242, 180, 85, 0.1)", // Subtle background color
                  "&:hover": {
                    backgroundColor: "rgba(242, 180, 85, 0.2)", // Slightly darker on hover
                  },
                  borderRadius: "4px", // Optional: adjust the border radius
                }}
              >
                {showExpensesChart ? (
                  <Svgs.barSvg strokeColor="#f2b455" />
                ) : (
                  <Svgs.areaChartSvg fillColor="#f2b455" />
                )}
              </IconButton>
            </Box>
          }
          // subtitle=""
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
                    stopColor={palette.secondary[400]}
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
                stroke={palette.secondary.main}
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
                    stopColor={palette.secondary[300]}
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
    </>
  );
};

export default Row1;
