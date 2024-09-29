import { useState, useMemo } from "react";
import { Box, useTheme, IconButton } from "@mui/material";
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
import api from "@/api/api";
import DashboardBox from "@/components/DashboardBox";
import BoxHeader from "@/components/BoxHeader";
import Svgs from "@/assets/Svgs";
import { useAccount } from "@/context/AccountContext/UseAccount";
import EditMonthlyValuesModal from "./EditMonthlyValuesModal"; // Adjust the import path as needed

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

function CombinedChart() {
  const { palette } = useTheme();
  const { account, fetchUserAccount } = useAccount();
  const [showChart, setShowChart] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonths, setEditingMonths] = useState<{
    [key: string]: MonthlyData;
  }>({});

  const revenueExpensesProfit = useMemo(() => {
    if (account?.monthlyData) {
      return account.monthlyData.map(({ month, revenue, expenses }) => ({
        name: month.substring(0, 3),
        revenue,
        expenses,
        profit: parseFloat((revenue - expenses).toFixed(2)),
      }));
    }
    return [];
  }, [account]);

  const handleChartToggle = () => setShowChart((prev) => !prev);

  const handleEditMonthlyValues = () => {
    const initialEditingMonths = account?.monthlyData.reduce(
      (acc, monthData) => {
        acc[monthData.month] = { ...monthData };
        return acc;
      },
      {} as { [key: string]: MonthlyData }
    );
    setEditingMonths(initialEditingMonths || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMonths({});
  };

  const handleInputChange = (
    month: string,
    field: "revenue" | "expenses",
    value: string
  ) => {
    setEditingMonths((prev) => ({
      ...prev,
      [month]: {
        ...prev[month],
        [field]: parseFloat(value), // Input is in dollars
      },
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const promises = Object.values(editingMonths).map((monthData) => {
        const dataToSave = {
          ...monthData,
          revenue: monthData.revenue, // Convert dollars to cents
          expenses: monthData.expenses, // Convert dollars to cents
        };
        return api.editMonthlyData(dataToSave);
      });
      await Promise.all(promises);
      fetchUserAccount(); // Refresh data after saving changes
      handleCloseModal(); // Close modal after saving changes
    } catch (error) {
      console.error("Failed to save changes:", error);
      // Handle error (e.g., show error message)
    }
  };

  const minValue = Math.min(
    ...revenueExpensesProfit.flatMap((item) => [
      item.revenue,
      item.expenses,
      item.profit,
    ])
  );

  return (
    <DashboardBox gridArea="d">
      <BoxHeader
        title={
          <Box display="flex" gap="10px" alignItems="center">
            <div>
              <span style={{ color: palette.tertiary[500] }}>Revenue</span>,{" "}
              <span style={{ color: palette.secondary[500] }}>Expenses</span>,{" "}
              {"& "}
              <span style={{ color: palette.primary[500] }}>Profit</span>
            </div>
            <IconButton
              onClick={handleChartToggle}
              size="small"
              sx={{
                backgroundColor: "rgba(131, 183, 166, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(131, 183, 166, 0.2)",
                  scale: 1.1,
                },
                borderRadius: "4px",
              }}
            >
              {showChart ? (
                <Svgs.barSvg strokeColor="#f2b455" />
              ) : (
                <Svgs.areaChartSvg fillColor="#f2b455" />
              )}
            </IconButton>
            <IconButton
              onClick={handleEditMonthlyValues}
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
              <Svgs.editSvg fillColor="#0ea5e9" size="24px" />
            </IconButton>
          </Box>
        }
        sideText="Use the edit button to edit monthly values"
      />
      <ResponsiveContainer width="100%" height="80%">
        {showChart ? (
          <AreaChart
            width={500}
            height={400}
            data={revenueExpensesProfit}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs></defs>
            <CartesianGrid vertical={false} strokeDasharray="1 2" />
            <XAxis dataKey="name" />
            <YAxis domain={[minValue, "auto"]} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="profit"
              stackId="1"
              dot={true}
              stroke={palette.primary[500]}
              fill="url(#colorProfit)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stackId="1"
              dot={true}
              stroke={palette.secondary[500]}
              fill="url(#colorExpenses)"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              dot={true}
              stroke={palette.tertiary[500]}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        ) : (
          <BarChart
            width={500}
            height={300}
            data={revenueExpensesProfit}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs></defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" stackId="a" fill="url(#colorRevenue)" />
            <Bar dataKey="expenses" stackId="b" fill="url(#colorExpenses)" />
            <Bar dataKey="profit" stackId="c" fill="url(#colorProfit)" />
          </BarChart>
        )}
      </ResponsiveContainer>
      <EditMonthlyValuesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        monthlyData={account?.monthlyData || []}
        editingMonths={editingMonths}
        handleInputChange={handleInputChange}
        handleSaveChanges={handleSaveChanges}
      />
    </DashboardBox>
  );
}

export default CombinedChart;
