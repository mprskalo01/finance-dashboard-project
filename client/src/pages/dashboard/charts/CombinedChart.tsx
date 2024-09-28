import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import {
  AreaChart,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Bar,
  // Legend,
  ResponsiveContainer,
} from "recharts";
import api from "@/api/api";
import DashboardBox from "@/components/DashboardBox";
import BoxHeader from "@/components/BoxHeader";
import Svgs from "@/assets/Svgs";
import { useAccount } from "@/context/AccountContext/UseAccount";

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

function CombinedChart() {
  const { palette } = useTheme();
  const { account, fetchUserAccount } = useAccount();
  const [showChart, setShowChart] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonth, setEditingMonth] = useState<MonthlyData | null>(null);

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

  const handleChartToggle = () => setShowChart((prev) => !prev);

  const handleEditMonthlyValues = () => {
    if (account?.monthlyData) {
      const latestMonth = account.monthlyData[account.monthlyData.length - 1];
      setEditingMonth(latestMonth);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMonth(null);
  };

  const handleInputChange = (field: "revenue" | "expenses", value: string) => {
    if (editingMonth) {
      setEditingMonth({
        ...editingMonth,
        [field]: Number(value),
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      const monthData = {
        month: editingMonth?.month || "",
        revenue: Number(editingMonth?.revenue) || 0,
        expenses: Number(editingMonth?.expenses) || 0,
      };
      await api.editMonthlyData(monthData);
      fetchUserAccount(); // Refresh data after saving changes
      handleCloseModal(); // Close modal after saving changes
    } catch (error) {
      console.error("Failed to save changes:", error);
      // Handle error (e.g., show error message)
    }
  };

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
                <Svgs.barSvg strokeColor="#83b7a6" />
              ) : (
                <Svgs.areaChartSvg fillColor="#83b7a6" />
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
            <CartesianGrid vertical={false} strokeDasharray="1 2" />
            <XAxis dataKey="name" />
            <YAxis domain={["auto", "auto"]} />
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
            {/* <Legend
              payload={[
                {
                  value: "Revenue",
                  type: "square",
                  color: palette.tertiary[500],
                },
                {
                  value: "Expenses",
                  type: "square",
                  color: palette.secondary[500],
                },
                {
                  value: "Profit",
                  type: "square",
                  color: palette.primary[500],
                },
              ]}
            /> */}
            <Bar dataKey="revenue" stackId="a" fill="url(#colorRevenue)" />
            <Bar dataKey="expenses" stackId="b" fill="url(#colorExpenses)" />
            <Bar dataKey="profit" stackId="c" fill="url(#colorProfit)" />
          </BarChart>
        )}
      </ResponsiveContainer>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: palette.grey[700],
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "2rem",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Edit Monthly Values
          </Typography>
          {account?.monthlyData.map((month) => (
            <Button
              key={month.month}
              onClick={() => setEditingMonth(month)}
              fullWidth
              variant={
                editingMonth?.month === month.month ? "contained" : "outlined"
              }
              sx={{ mb: 1 }}
            >
              {month.month}
            </Button>
          ))}
          {editingMonth && (
            <Box mt={2}>
              <TextField
                label="Revenue"
                type="number"
                value={editingMonth.revenue}
                onChange={(e) => handleInputChange("revenue", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Expenses"
                type="number"
                value={editingMonth.expenses}
                onChange={(e) => handleInputChange("expenses", e.target.value)}
                fullWidth
                margin="normal"
              />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  onClick={handleCloseModal}
                  sx={{
                    mr: 1,
                    backgroundColor: palette.secondary[500],
                    color: palette.grey[700],
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  sx={{
                    backgroundColor: palette.primary[500],
                    color: palette.grey[700],
                  }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </DashboardBox>
  );
}

export default CombinedChart;
