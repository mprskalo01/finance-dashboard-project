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

    fetchUserAccount();
  }, []);

  useEffect(() => {
    const fetchLstmPredictions = async () => {
      try {
        if (account) {
          const response = await api.getFinancialPredictions(
            account.monthlyData
          );
          setLstmPredictions(response.data.predictedRevenues);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchLstmPredictions();
  }, [account]);

  const { formattedData, minValue, maxValue } = useMemo(() => {
    if (!account) return { formattedData: [], minValue: 0, maxValue: 0 };
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
    const formatted: Array<DataPoint> = monthData.map(
      ({ revenue }, i: number) => [i, revenue]
    );
    const regressionLine = regression.linear(formatted);
    const data = allMonths.map((month, i) => {
      const actualData = monthData.find(
        (data) => data.month.toLowerCase() === month.toLowerCase()
      );
      return {
        name: month,
        "Actual Revenue": actualData ? actualData.revenue : null,
        "Regression Line": regressionLine.points[i]
          ? regressionLine.points[i][1]
          : null,
        "Next Year Predicted Revenue": regressionLine.predict(
          i + monthData.length
        )[1],
        "Current Year Predicted Revenue": lstmPredictions[i] || null,
      };
    });

    const allValues = data.flatMap((d) =>
      [
        "Actual Revenue",
        "Regression Line",
        "Next Year Predicted Revenue",
        "Current Year Predicted Revenue",
      ]
        .map((key) => d[key as keyof typeof d])
        .filter((value) => value !== null)
    );

    const numericValues = allValues.filter(
      (value): value is number => typeof value === "number"
    );
    const minValue = Math.min(...numericValues);
    const maxValue = Math.max(...numericValues);

    return { formattedData: data, minValue, maxValue };
  }, [account, lstmPredictions]);

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
              Next year based on simple linear regression, current year based on
              LTSM
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
              domain={[Math.min(minValue - 200, 0), maxValue + 200]}
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
