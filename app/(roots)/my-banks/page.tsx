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


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
  type: string; 
}

const Analysis = () => {
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");


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

  const groupedByMonth = transactionData.reduce(
    (acc: Record<string, Transaction[]>, transaction) => {
      const month = new Date(transaction.date).toLocaleString("default", { month: "long" });
      if (!acc[month]) acc[month] = [];
      acc[month].push(transaction);
      return acc;
    },
    {}
  );

  const months = Object.keys(groupedByMonth);
  const doughnutData = months.map((month) => {
    const transactions = groupedByMonth[month];
    const categories = Array.from(new Set(transactions.map((t) => t.category)));
    return {
      month,
      data: {
        labels: categories,
        datasets: [
          {
            label: `${month} Transaction Contribution`,
            data: categories.map(
              (category) =>
                transactions.filter((t) => t.category === category).reduce((sum, t) => sum + t.amount, 0) || 0
            ),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          },
        ],
      },
    };
  });

  useEffect(() => {
    if (months.length > 0) {
      setSelectedMonth(months[0]);
    }
  }, [months]);


  const incomeExpenseData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: months.map((month) => {
          const monthTransactions = groupedByMonth[month] || [];
          return monthTransactions
            .filter((transaction) => transaction.category.toLowerCase() === "income")
            .reduce((acc, transaction) => acc + Number(transaction.amount), 0);
        }),
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Expenses",
        data: months.map((month) => {
          const monthTransactions = groupedByMonth[month] || [];
          return monthTransactions
            .filter((transaction) => transaction.category.toLowerCase() === "expense")
            .reduce((acc, transaction) => acc + Number(transaction.amount), 0);
        }),
        backgroundColor: "#FF6384",
      },
    ],
  };

  // Cumulative Savings Data
  const cumulativeSavingsData = {
    labels: months,
    datasets: [
      {
        label: "Cumulative Savings",
        data: months.reduce((acc: number[], month, idx) => {
          const previousSavings = idx > 0 ? acc[idx - 1] : 0;
          const income = incomeExpenseData.datasets[0].data[idx] || 0;
          const expenses = incomeExpenseData.datasets[1].data[idx] || 0;
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

      <div className="p-6">
        {/* Dropdown to select a month */}
        <div className="mb-4">
          <label htmlFor="month-select" className="block text-lg font-medium mb-2">
            Select Month:
          </label>
          <select
            id="month-select"
            className="p-2 border rounded w-full"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Display the selected month's Doughnut Chart */}
        {doughnutData
          .filter(({ month }) => month === selectedMonth)
          .map(({ month, data }) => (
            <div key={month} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">{month} Transaction Contribution</h2>
              <Doughnut data={data} />
            </div>
          ))}

        {/* Right-side Charts */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
