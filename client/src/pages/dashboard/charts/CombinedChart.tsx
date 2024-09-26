import { useMemo, useState, useEffect } from "react";
import {
  Box,
  useTheme,
  IconButton,
  Modal,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import {
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import api from "@/api/api";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import Svgs from "@/assets/Svgs";
import { AxiosError } from "axios";

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

interface Account {
  monthlyData: MonthlyData[];
  currentBalance: number;
  totalRevenue: number;
  totalExpenses: number;
}

function CombinedChart() {
  const { palette } = useTheme();
  const [account, setAccount] = useState<Account | null>(null);
  const [showChart, setShowChart] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonth, setEditingMonth] = useState<MonthlyData | null>(null);

  useEffect(() => {
    fetchUserAccount();
  }, []);

  const fetchUserAccount = async () => {
    try {
      const response = await api.getUserAccount();
      console.log("Fetched account data:", response.data);
      setAccount(response.data);
    } catch (err) {
      console.error("Failed to fetch user account:", err);
    }
  };

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

  const handleEditMonthlyValues = () => setIsModalOpen(true);

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
    if (!editingMonth) {
      console.error("No month selected for editing");
      return;
    }

    // Optimistically update the account state
    setAccount((prevAccount) => {
      if (!prevAccount) return prevAccount; // If no account, return

      const updatedMonthlyData = prevAccount.monthlyData.map((monthData) => {
        if (monthData.month === editingMonth.month) {
          return {
            ...monthData,
            revenue: editingMonth.revenue,
            expenses: editingMonth.expenses,
          };
        }
        return monthData;
      });

      return {
        ...prevAccount,
        monthlyData: updatedMonthlyData,
      };
    });

    try {
      const response = await api.editMonthlyData({
        month: editingMonth.month,
        revenue: editingMonth.revenue,
        expenses: editingMonth.expenses,
      });

      console.log("API response:", response);

      // Handle success case
      if (response.data.account) {
        setAccount(response.data.account);
      }

      handleCloseModal();
    } catch (error) {
      const axiosError = error as AxiosError;

      console.error("Failed to update monthly data:", axiosError);
      // Handle rollback if needed, or display an error message
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
            <IconButton onClick={handleChartToggle} size="small">
              {showChart ? (
                <Svgs.barSvg strokeColor="#83b7a6" />
              ) : (
                <Svgs.areaChartSvg fillColor="#83b7a6" />
              )}
            </IconButton>
            <IconButton onClick={handleEditMonthlyValues} size="small">
              <Svgs.editSvg fillColor="#0ea5e9" />
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
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.secondary[300]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.secondary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
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
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={palette.tertiary[500]} />
                <stop offset="95%" stopColor={palette.tertiary[400]} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={palette.secondary[500]} />
                <stop offset="95%" stopColor={palette.secondary[400]} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={palette.primary[500]} />
                <stop offset="95%" stopColor={palette.primary[400]} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
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
            borderRadius: "2rem"
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
              <Typography variant="subtitle1" gutterBottom>
                Editing: {editingMonth.month}
              </Typography>
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
              <Box mt={2} display="flex" justifyContent="space-between">
                <Button onClick={handleCloseModal} variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  variant="contained"
                  color="primary"
                >
                  Save Changes
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
