import RevenueChart from "./charts/RevenueChart";
import ExpensesChart from "./charts/ExpensesChart";
import ProfitChart from "./charts/ProfitChart";

const Row1 = () => {
  return (
    <>
      <RevenueChart />
      <ExpensesChart />
      <ProfitChart />
    </>
  );
};

export default Row1;
