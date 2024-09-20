import { useState, useEffect, useMemo } from "react";
import { HashLoader } from "react-spinners";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery, useGetProductsQuery } from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import {
  Tooltip,
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  TooltipProps,
} from "recharts";

const Row2 = () => {
  const { palette } = useTheme();
  const { data: operationalData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();

  const [loading, setLoading] = useState(true);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [currentMonthProfit, setCurrentMonthProfit] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);

  useEffect(() => {
    if (operationalData && operationalData[0].monthlyData.length > 0) {
      const currentMonthName = new Date()
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      const currentMonthData = operationalData[0].monthlyData.find(
        (data) => data.month.toLowerCase() === currentMonthName
      );

      if (currentMonthData) {
        setCurrentMonthRevenue(currentMonthData.revenue);
        setCurrentMonthExpenses(currentMonthData.expenses);
        setCurrentMonthProfit(
          currentMonthData.revenue - currentMonthData.expenses
        );
      } else {
        // Handle case when there's no data for the current month
        setCurrentMonthRevenue(0);
        setCurrentMonthExpenses(0);
        setCurrentMonthProfit(0);
      }
      setLoading(false);
    }
  }, [operationalData]);

  const operationalExpenses = useMemo(() => {
    return (
      operationalData &&
      operationalData[0].monthlyData.map(
        ({ month, operationalExpenses, nonOperationalExpenses }) => {
          return {
            name: month.substring(0, 3),
            "Operational Expenses": operationalExpenses,
            "Non Operational Expenses": nonOperationalExpenses,
          };
        }
      )
    );
  }, [operationalData]);

  const productExpenseData = useMemo(() => {
    return (
      productData &&
      productData.map(({ _id, name, price, expense }) => {
        return {
          name: name,
          id: _id,
          price: price,
          expense: expense,
        };
      })
    );
  }, [productData]);

  const operationalExpensesChange = useMemo(() => {
    if (
      operationalData &&
      operationalData[0] &&
      operationalData[0].monthlyData.length > 1
    ) {
      const latest = operationalData[0].monthlyData.slice(-1)[0];
      const previous = operationalData[0].monthlyData.slice(-2)[0];

      if (latest && previous) {
        const operationalChange =
          previous.operationalExpenses !== 0
            ? ((latest.operationalExpenses - previous.operationalExpenses) /
                previous.operationalExpenses) *
              100
            : 0;

        const nonOperationalChange =
          previous.nonOperationalExpenses !== 0
            ? ((latest.nonOperationalExpenses -
                previous.nonOperationalExpenses) /
                previous.nonOperationalExpenses) *
              100
            : 0;

        const formatChange = (value: number) =>
          value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);

        return {
          operationalText: `Op: ${formatChange(operationalChange)}%`,
          nonOperationalText: `Non-Op: ${formatChange(nonOperationalChange)}%`,
        };
      }
    }
    return {
      operationalText: "Op: 0%",
      nonOperationalText: "Non-Op: 0%",
    };
  }, [operationalData]);

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const { name, price, expense } = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            padding: "10px",
            borderRadius: "5px",
            color: "#fff",
          }}
        >
          <p>{`Name: ${name}`}</p>
          <p>{`Price: $${price}`}</p>
          <p>{`Expense: $${expense}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <DashboardBox gridArea="d">
        <BoxHeader
          title={
            <>
              <span style={{ color: palette.secondary[700] }}>Operational</span>{" "}
              &{" "}
              <span style={{ color: palette.secondary[400] }}>
                Non-Operational Expenses
              </span>
            </>
          }
          sideText={
            <>
              <span style={{ color: palette.secondary[700] }}>
                {operationalExpensesChange.operationalText}
              </span>{" "}
              |{" "}
              <span style={{ color: palette.secondary[400] }}>
                {operationalExpensesChange.nonOperationalText}
              </span>
            </>
          }
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={operationalExpenses}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Non Operational Expenses"
              stroke={palette.secondary[400]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Operational Expenses"
              stroke={palette.secondary[700]}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
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
              position="relative" // Added relative positioning for the inner Box
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                color={palette.tertiary[500]}
              >
                Revenue
              </Typography>
              <Typography
                variant="h1"
                color={palette.primary[300]}
                mt={2}
                sx={{ marginBottom: "4rem" }} // Adjusted margin-bottom
              >
                ${currentMonthRevenue.toLocaleString()}
              </Typography>
              <Box
                position="absolute" // Absolute positioning
                bottom={50} // Position from the bottom
                right={8} // Position from the right
                textAlign="right"
              >
                <Typography variant="h4" color={palette.primary[500]}>
                  Profit: ${currentMonthProfit.toLocaleString()}
                </Typography>
                <Typography variant="h5" color={palette.secondary[400]}>
                  Expenses: ${currentMonthExpenses.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </DashboardBox>
      <DashboardBox gridArea="f">
        <BoxHeader
          title={
            <>
              <span style={{ color: palette.tertiary[500] }}>
                Product Prices
              </span>{" "}
              & <span style={{ color: palette.secondary[500] }}>Expenses</span>
            </>
          }
          sideText="Margin of products"
        />
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 25,
              bottom: 40,
              left: -10,
            }}
          >
            <CartesianGrid stroke={palette.grey[800]} />
            <XAxis
              type="number"
              dataKey="price"
              name="price"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              type="number"
              dataKey="expense"
              name="expense"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <ZAxis type="number" dataKey="price" range={[50, 150]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              data={productExpenseData}
              fill={palette.primary[300]}
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row2;
