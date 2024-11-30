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

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // For AM/PM
    };
    return new Date(date).toLocaleString("en-US", options);
  };

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
          date: formatDate(transaction.date), // Format the date
          category: transaction.category,
        }))
      );
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/fetch-transactions?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete transaction");

      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete transaction");
    }
  };

  const editTransaction = async (id: string, updatedData: Partial<Transaction>) => {
    try {
      const response = await fetch(`/api/fetch-transactions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, data: updatedData }),
      });

      if (!response.ok) throw new Error("Failed to update transaction");

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? { ...transaction, ...updatedData } : transaction
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to update transaction");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
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
                  <td className="px-4 py-2 text-sm text-gray-600">{transaction.date}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{transaction.category}</td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => editTransaction(transaction.id, { name: "Updated Name" })}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline ml-2"
                      onClick={() => deleteTransaction(transaction.id)}
                    >
                      Delete
                    </button>
                  </td>
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
