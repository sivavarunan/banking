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
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import Loading from "@/components/ui/loading";
import Error from "../../error";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
  name: string;
  type: string;
}

const generateGradientColors = (baseColor: string, count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const lightness = 50 + i * (40 / count); 
    return `hsl(${baseColor}, 70%, ${lightness}%)`;
  });
};

const getCategoryBaseColor = (type: string) => {
  if (type.toLowerCase() === "income") return "120"; 
  if (type.toLowerCase() === "expense") return "0"; 
  return "200"; 
};

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
            name: transaction.name,
            type: transaction.category || "expense",
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
    const transactionAmounts = transactions.map((transaction) => transaction.amount);
    const transactionCount = transactions.length;

    return {
      month,
      data: {
        labels: transactions.map((transaction) => `${transaction.name} (${transaction.amount})`),
        datasets: [
          {
            label: `Transactions in ${month}`,
            data: transactionAmounts,
            backgroundColor: transactions.map((transaction, index) => {
              const baseColor = getCategoryBaseColor(transaction.type);
              return generateGradientColors(baseColor, transactionCount)[index];
            }),
          },
        ],
      },
    };
  });

  useEffect(() => {
    if (months.length > 0 && !selectedMonth) {
      setSelectedMonth(months[0]);
    }
  }, [months, selectedMonth]);

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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} reset={() => window.location.reload()} />;
  }

  return (
    <div className="home-content p-4">
      <header className="home-header mb-4">
        <HeaderBox type="greeting" title="Analysis" subtext="Gain insights into your financial activity" />
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="mb-6 lg:mb-0 lg:col-span-1">
          <label htmlFor="month-select" className="block text-lg font-medium mb-2">
            Select Month:
          </label>
          <select
            id="month-select"
            className="p-2 border rounded w-full mb-4"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          {doughnutData
            .filter(({ month }) => month === selectedMonth)
            .map(({ month, data }) => (
              <div key={month} className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4 text-center">{month} Transactions</h2>
                <div className="relative h-96 mx-auto">
                  <Doughnut
                    data={data}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: true },
                      },
                    }}
                  />
                </div>
              </div>
            ))}
        </div>

        <div className="mb-6 lg:col-span-2">
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
        </div>
      </div>
    </div>
  );
};

export default Analysis;
