'use client';
import React, { useEffect, useState } from "react";
import HeaderBox from "@/components/ui/HeaderBox";

interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
}

interface TransactionAPIResponse {
  transactions: {
    $id: string;
    name: string;
    amount: number;
    date: string;
    category: string;
  }[];
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/fetch-transactions');
        if (!response.ok) throw new Error("Failed to fetch transactions");

        const data: TransactionAPIResponse = await response.json();
        setTransactions(
          data.transactions.map((transaction) => ({
            id: transaction.$id,
            name: transaction.name,
            amount: transaction.amount,
            date: transaction.date,
            category: transaction.category,
          }))
        );
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="home-content">
      <div className="p-4 bg-gray-50 rounded-md shadow-md">
        <header className="home-header">
          <HeaderBox type="greeting" title="Transaction History" subtext="" />
        </header>
        <div className="overflow-x-auto mt-10">
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2 text-sm text-gray-800">{transaction.name}</td>
                  <td
                    className={`px-4 py-2 text-sm ${
                      transaction.category.toLowerCase() === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.category.toLowerCase() === "income"
                      ? `+ $${transaction.amount}`
                      : `- $${transaction.amount}`}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">{transaction.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
