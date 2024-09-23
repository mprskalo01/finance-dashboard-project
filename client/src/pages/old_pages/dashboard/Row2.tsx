import { useState, useEffect, useMemo } from "react";
import { HashLoader } from "react-spinners";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery, useGetProductsQuery } from "@/api/api";
import { Box, Typography, useTheme } from "@mui/material";
import {
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ScatterChart,
  Scatter,
  ZAxis,
  TooltipProps,
} from "recharts";
import FlexBetween from "@/components/FlexBetween";

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

  // const operationalExpenses = useMemo(() => {
  //   return (
  //     operationalData &&
  //     operationalData[0].monthlyData.map(
  //       ({ month, operationalExpenses, nonOperationalExpenses }) => {
  //         return {
  //           name: month.substring(0, 3),
  //           "Operational Expenses": operationalExpenses,
  //           "Non Operational Expenses": nonOperationalExpenses,
  //         };
  //       }
  //     )
  //   );
  // }, [operationalData]);

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

  // const operationalExpensesChange = useMemo(() => {
  //   if (
  //     operationalData &&
  //     operationalData[0] &&
  //     operationalData[0].monthlyData.length > 1
  //   ) {
  //     const latest = operationalData[0].monthlyData.slice(-1)[0];
  //     const previous = operationalData[0].monthlyData.slice(-2)[0];

  //     if (latest && previous) {
  //       const operationalChange =
  //         previous.operationalExpenses !== 0
  //           ? ((latest.operationalExpenses - previous.operationalExpenses) /
  //               previous.operationalExpenses) *
  //             100
  //           : 0;

  //       const nonOperationalChange =
  //         previous.nonOperationalExpenses !== 0
  //           ? ((latest.nonOperationalExpenses -
  //               previous.nonOperationalExpenses) /
  //               previous.nonOperationalExpenses) *
  //             100
  //           : 0;

  //       const formatChange = (value: number) =>
  //         value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);

  //       return {
  //         operationalText: `Op: ${formatChange(operationalChange)}%`,
  //         nonOperationalText: `Non-Op: ${formatChange(nonOperationalChange)}%`,
  //       };
  //     }
  //   }
  //   return {
  //     operationalText: "Op: 0%",
  //     nonOperationalText: "Non-Op: 0%",
  //   };
  // }, [operationalData]);

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
          <p>{`Margin: $${price - expense}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
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
              <FlexBetween sx={{ gap: "1.5rem" }}>
                <div>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={palette.tertiary[500]}
                    sx={{
                      fontSize: {
                        xs: "1.5rem", // smaller size on extra-small screens
                        sm: "1.5rem", // small size on small screens
                        md: "1rem", // default for medium screens and above
                        xl: "1.25rem",
                      },
                    }}
                  >
                    Revenue
                  </Typography>
                  <Typography
                    variant="h4"
                    color={palette.tertiary[500]}
                    mt={2}
                    sx={{
                      marginBottom: "4rem",
                      fontSize: {
                        xs: "1.5rem", // smaller size on extra-small screens
                        sm: "1.5rem", // small size on small screens
                        md: "1rem", // default for medium screens and above
                        xl: "1.25rem",
                      },
                    }}
                  >
                    ${currentMonthRevenue.toLocaleString()}
                  </Typography>
                </div>

                <div>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={palette.secondary[500]}
                    sx={{
                      fontSize: {
                        xs: "1.5rem", // smaller size on extra-small screens
                        sm: "1.5rem", // small size on small screens
                        md: "1rem", // default for medium screens and above
                        xl: "1.25rem",
                      },
                    }}
                  >
                    Expenses
                  </Typography>
                  <Typography
                    variant="h4"
                    color={palette.secondary[500]}
                    mt={2}
                    sx={{
                      marginBottom: "4rem",
                      fontSize: {
                        xs: "1.5rem", // smaller size on extra-small screens
                        sm: "1.5rem", // small size on small screens
                        md: "1rem", // default for medium screens and above
                        xl: "1.25rem",
                      },
                    }}
                  >
                    ${currentMonthExpenses.toLocaleString()}
                  </Typography>
                </div>

                <div>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={palette.primary[500]}
                    sx={{
                      fontSize: {
                        xs: "1.5rem", // smaller size on extra-small screens
                        sm: "1.5rem", // small size on small screens
                        md: "1rem", // default for medium screens and above
                        xl: "1.25rem",
                      },
                    }}
                  >
                    Profit
                  </Typography>
                  <Typography
                    variant="h4"
                    color={palette.primary[300]}
                    mt={2}
                    sx={{
                      marginBottom: "4rem",
                      fontSize: {
                        xs: "1.5rem", // smaller size on extra-small screens
                        sm: "1.5rem", // small size on small screens
                        md: "1rem", // default for medium screens and above
                        xl: "1.25rem",
                      },
                    }}
                  >
                    ${currentMonthProfit.toLocaleString()}
                  </Typography>
                </div>
              </FlexBetween>
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
