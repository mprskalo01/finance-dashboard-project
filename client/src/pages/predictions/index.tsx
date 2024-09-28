import { useMemo, useState, useEffect } from "react";
import { useTheme, Box, Button, Typography } from "@mui/material";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import regression, { DataPoint } from "regression";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import api from "@/api/api";
import Navbar from "@/components/navbar";

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

interface Account {
  monthlyData: MonthlyData[];
}

const Predictions = () => {
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState(false);
  const [isCurrentYearPredictions, setIsCurrentYearPredictions] =
    useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [lstmPredictions, setLstmPredictions] = useState<number[]>([]);

  useEffect(() => {
    const fetchUserAccount = async () => {
      try {
        const response = await api.getUserAccount();
        setAccount(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchLstmPredictions = async () => {
      try {
        const response = await api.getFinancialPredictions();
        setLstmPredictions(response.data.predictedRevenues);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserAccount();
    fetchLstmPredictions();
  }, []); // Add dependency array to avoid infinite loop

  const formattedData = useMemo(() => {
    if (!account) return [];
    const allMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthData = account?.monthlyData;
    console.log("Month Data:", monthData); // Log month data
    const formatted: Array<DataPoint> = monthData.map(
      ({ revenue }, i: number) => [i, revenue]
    );
    console.log("Formatted Data Points:", formatted); // Log formatted data points
    const regressionLine = regression.linear(formatted);
    console.log("Regression Line:", regressionLine); // Log regression line
    return allMonths.map((month, i) => {
      const actualData = monthData.find(
        (data) => data.month.toLowerCase() === month.toLowerCase()
      );
      console.log(`Actual Data for ${month}:`, actualData); // Log actual data for each month
      return {
        name: month,
        "Actual Revenue": actualData ? actualData.revenue : null,
        "Regression Line": regressionLine.points[i]
          ? regressionLine.points[i][1]
          : null,
        "Predicted Revenue": regressionLine.predict(i + monthData.length)[1],
        "LSTM Predicted Revenue": lstmPredictions[i] || null,
      };
    });
  }, [account, lstmPredictions]);

  console.log("Formatted Data for Chart:", formattedData); // Log formatted data for chart

  return (
    <>
      <Navbar />
      <DashboardBox width="100%" height="100%" p="1rem" overflow="hidden">
        <FlexBetween m="1rem 2.5rem" gap="1rem">
          <Box>
            <Typography variant="h3">
              <span style={{ color: palette.tertiary[500] }}>Revenue</span> &{" "}
              <span style={{ color: "#0ea5e9" }}>Predictions</span>
            </Typography>
            <Typography variant="h6">
              charted revenue and predicted revenue based on a simple linear
              regression model
            </Typography>
          </Box>
          <FlexBetween gap="1rem">
            <Button
              onClick={() => setIsPredictions(!isPredictions)}
              sx={{
                color: palette.grey[100],
                backgroundColor: palette.tertiary[500],
                boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.15)",
                },
              }}
            >
              {isPredictions ? "Hide " : "Show "}Next Year Predictions
            </Button>
            <Button
              onClick={() =>
                setIsCurrentYearPredictions(!isCurrentYearPredictions)
              }
              sx={{
                color: palette.grey[100],
                backgroundColor: palette.secondary[500],
                boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.15)",
                },
              }}
            >
              {isCurrentYearPredictions ? "Hide " : "Show "}
              Current Year Predictions
            </Button>
          </FlexBetween>
        </FlexBetween>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 20,
              right: 75,
              left: 20,
              bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
            <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }}>
              <Label value="Month" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis
              domain={["auto", "auto"]}
              axisLine={{ strokeWidth: "0" }}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            >
              <Label
                value="Revenue in USD"
                angle={-90}
                offset={-5}
                position="insideLeft"
              />
            </YAxis>
            <Tooltip />
            <Legend verticalAlign="top" />
            <Line
              type="monotone"
              dataKey="Actual Revenue"
              stroke={palette.tertiary[500]}
              strokeWidth={3}
              dot={{ strokeWidth: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Regression Line"
              stroke={"#e11d48"}
              strokeWidth={isPredictions ? 3 : 0}
              dot={false}
              style={{
                opacity: isPredictions ? 1 : 0,
                transition:
                  "opacity 300ms ease-in-out, strokeWidth 300ms ease-in-out",
              }}
            />
            <Line
              type="monotone"
              dataKey="Next Year Predicted Revenue"
              stroke={"#0ea5e9"}
              strokeDasharray="5 5"
              strokeWidth={isPredictions ? 3 : 0}
              dot={false}
              style={{
                opacity: isPredictions ? 1 : 0,
                transition:
                  "opacity 300ms ease-in-out, strokeWidth 300ms ease-in-out",
              }}
            />
            <Line
              type="monotone"
              dataKey="Current Year Predicted Revenue"
              stroke={"#ff9800"}
              strokeDasharray="3 3"
              strokeWidth={isCurrentYearPredictions ? 3 : 0}
              dot={false}
              style={{
                opacity: isCurrentYearPredictions ? 1 : 0,
                transition:
                  "opacity 300ms ease-in-out, strokeWidth 300ms ease-in-out",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Predictions;
