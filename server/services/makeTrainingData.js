import { writeFileSync } from "fs";

function populateTrainJson(number) {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const monthlyData = [];

  for (const month of months) {
    for (let i = 0; i < number; i++) {
      const revenue = Math.random() * (100000 - 1000) + 1000;
      const expenses = Math.random() * (99000 - 500) + 500;
      monthlyData.push({
        month: month,
        revenue: parseFloat(revenue.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
      });
    }
  }

  const data = { monthlyData };

  writeFileSync("train.json", JSON.stringify(data, null, 2));
}

// Example usage:
populateTrainJson(50000);
