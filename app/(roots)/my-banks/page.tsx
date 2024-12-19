"use client";

import { useState, useEffect } from "react";
import HeaderBox from "@/components/ui/HeaderBox";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import Loading from "@/components/ui/loading";
import Error from "../../error";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
  type: string; // "income" or "expense"
}

const Analysis = () => {
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch transactions from the API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/fetch-transactions");
        if (!response.ok) throw Error;

        const data = await response.json();
        setTransactionData(
          data.transactions.map((transaction: any) => ({
            id: transaction.$id,
            amount: Number(transaction.amount),
            date: transaction.date,
            category: transaction.category,
            type: transaction.type || "expense",
          }))
        );
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Prepare data for the charts
  const transactionCategories = ["Groceries", "Dining", "Subscription", "Transportation", "Miscellaneous"];
  const transactionContributionData = {
    labels: transactionCategories,
    datasets: [
      {
        label: "Transaction Contribution",
        data: transactionCategories.map(
          (category) =>
            transactionData.filter((t) => t.category === category).reduce((sum, t) => sum + t.amount, 0) || 0
        ),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const monthlyIncomeExpense = transactionData.reduce(
    (acc: Record<string, { income: number; expenses: number }>, transaction) => {
      const month = new Date(transaction.date).toLocaleString("default", { month: "long" });
      if (!acc[month]) acc[month] = { income: 0, expenses: 0 };

      if (transaction.type === "income") {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
      }
      return acc;
    },
    {}
  );

  const incomeExpenseData = {
    labels: Object.keys(monthlyIncomeExpense),
    datasets: [
      {
        label: "Income",
        data: Object.values(monthlyIncomeExpense).map((entry) => entry.income),
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Expenses",
        data: Object.values(monthlyIncomeExpense).map((entry) => entry.expenses),
        backgroundColor: "#FF6384",
      },
    ],
  };

  const cumulativeSavingsData = {
    labels: Object.keys(monthlyIncomeExpense),
    datasets: [
      {
        label: "Cumulative Savings",
        data: Object.values(monthlyIncomeExpense).reduce((acc: number[], { income, expenses }) => {
          const previousSavings = acc.length > 0 ? acc[acc.length - 1] : 0;
          acc.push(previousSavings + income - expenses);
          return acc;
        }, []),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Render the component
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} reset={() => window.location.reload()} />;
  }

  return (
    <div className="home-content">
      <header className="home-header">
        <HeaderBox type="greeting" title="Analysis" subtext="Gain insights into your financial activity" />
      </header>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Contribution Doughnut Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Transaction Contribution</h2>
          <Doughnut data={transactionContributionData} />
        </div>

        {/* Right-side Charts */}
        <div className="flex flex-col gap-6 lg:col-span-1">
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
    </div>
  );
};

export default Analysis;
