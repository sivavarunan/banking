"use client";

import HeaderBox from "@/components/ui/HeaderBox";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const Analysis = () => {
  // Data for Pie Chart: Contribution of Transactions
  const transactionContributionData = {
    labels: ["Groceries", "Dining", "Subscription", "Transportation", "Miscellaneous"],
    datasets: [
      {
        label: "Transaction Contribution",
        data: [150, 200, 80, 120, 50], // Replace with actual transaction data
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  // Data for Bar Chart: Monthly Income vs Expenses
  const incomeExpenseData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Income",
        data: [3000, 3200, 2800, 3400, 3100], // Replace with dynamic income data
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Expenses",
        data: [2500, 2600, 2400, 2900, 2700], // Replace with dynamic expense data
        backgroundColor: "#FF6384",
      },
    ],
  };

  // Data for Line Chart: Cumulative Savings
  const cumulativeSavingsData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Cumulative Savings",
        data: [500, 1100, 1500, 2000, 2400], // Replace with cumulative savings data
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="home-content">
      <header className="home-header">
        <HeaderBox type="greeting" title="Analysis" subtext="Gain insights into your financial activity" />
      </header>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Transaction Contribution Pie Chart */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Transaction Contribution</h2>
          <Doughnut data={transactionContributionData} />
        </div>

        {/* Monthly Income vs Expenses Bar Chart */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Monthly Income vs Expenses</h2>
          <Bar
            data={incomeExpenseData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
            }}
          />
        </div>

        {/* Cumulative Savings Line Chart */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Cumulative Savings</h2>
          <Line
            data={cumulativeSavingsData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
