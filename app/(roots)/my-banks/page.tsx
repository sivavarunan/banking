'use client'
import HeaderBox from "@/components/ui/HeaderBox";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Analysis = () => {
  const spendingData = {
    labels: ["Food", "Rent", "Entertainment", "Utilities", "Transport"],
    datasets: [
      {
        label: "Spending Distribution",
        data: [300, 800, 200, 150, 100], 
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const incomeExpenseData = {
    labels: ["January", "February", "March", "April", "May"], 
    datasets: [
      {
        label: "Income",
        data: [2000, 2200, 1800, 2400, 2000], 
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Expenses",
        data: [1800, 1900, 1700, 2000, 1800], 
        backgroundColor: "#FF6384",
      },
    ],
  };

  return (
    <div className="home-content">
      <header className="home-header">
        <HeaderBox type="greeting" title="Analysis" subtext="Gain insights into your financial activity" />
      </header>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
   
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Spending Breakdown</h2>
          <Doughnut data={spendingData}/>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Income vs. Expenses</h2>
          <Bar data={incomeExpenseData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
