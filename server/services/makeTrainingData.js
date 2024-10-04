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
      for (let j = 0; j < 1000; j++) {
        let revenue, expenses;
        do {
          revenue = Math.random() * 100000 + i * 100000;
          expenses = Math.random() * 100000 + i * 100000;
        } while (revenue < expenses * 1.1);

        monthlyData.push({
          month: month,
          revenue: parseFloat(revenue.toFixed(2)),
          expenses: parseFloat(expenses.toFixed(2)),
        });
      }
    }
  }

  const data = { monthlyData };

  writeFileSync("train.json", JSON.stringify(data, null, 2));
}

// Example usage:
populateTrainJson(1); // This will generate 1 * 1000 values for each month
