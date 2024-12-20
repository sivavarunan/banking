"use client";
import React, { useEffect, useState } from "react";
import HeaderBox from "@/components/ui/HeaderBox";
import { Input } from "@/components/ui/input";
import { Trash2Icon, PenBoxIcon, SaveIcon } from "lucide-react";
import Loading from "@/components/ui/loading";
import Error from "../../error";
import { Label } from "@/components/ui/label";

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
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editedTransaction, setEditedTransaction] = useState<Partial<Transaction>>({});

  // Calculate the total amount by summing income and subtracting expenses
  const totalAmount = transactions.reduce((sum, transaction) => {
    return transaction.category.toLowerCase() === "income"
      ? sum + transaction.amount
      : sum - transaction.amount;
  }, 0);

  // Format a date string for display
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return new Date(date).toLocaleString("en-US", options);
  };

  // Fetch transactions from the API
  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/fetch-transactions");
      if (!response.ok) throw Error;

      const data: TransactionAPIResponse = await response.json();
      setTransactions(
        data.transactions.map((transaction) => ({
          id: transaction.$id,
          name: transaction.name,
          amount: Number(transaction.amount),
          date: formatDate(transaction.date),
          category: transaction.category,
        }))
      );
      setTotalTransactions(data.transactions.length);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Delete a transaction by ID
  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/fetch-transactions?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw Error;

      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
      setTotalTransactions((prev) => prev - 1);
    } catch (err: any) {
      setError(err.message || "Failed to delete transaction");
    }
  };

  // Start editing a transaction
  const editTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setEditedTransaction({ ...transaction, date: new Date().toISOString() });
      setEditing(id);
    }
  };

  const saveEditedTransaction = async () => {
    try {
      const updatedTransaction = {
        name: editedTransaction.name,
        amount: editedTransaction.amount,
        category: editedTransaction.category,
        date: editedTransaction.date || new Date().toISOString(),
      };
  
      console.log("Payload sent to API:", {
        id: editing,
        data: updatedTransaction,
      });
  
      const response = await fetch("/api/fetch-transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing, // Transaction ID
          data: updatedTransaction, // Fields to update
        }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        throw Error;
      }
  
      const result = await response.json();
      console.log("Update successful:", result);
      // Update state, close modal, etc.
    } catch (err: any) {
      console.error("Error on editing transaction:", err.message);
      setError(err.message || "Failed to update transaction");
    }
  };
  
  
  // Retry fetching transactions
  const retryFetchTransactions = () => {
    setLoading(true);
    setError(null);
    fetchTransactions();
  };

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Show loading spinner
  if (loading) {
    return <div className="text-center text-gray-600"><Loading /></div>;
  }

  // Show error message if an error occurred
  if (error) {
    return <Error error={error} reset={retryFetchTransactions} />;
  }

  return (
    <div className="home-content">
      <div className="p-4 bg-gray-50 rounded-md shadow-md">
        <header className="home-header">
          <HeaderBox type="greeting" title="Transaction History" subtext="" />
        </header>

        {/* Summary Section */}
        <div className="my-4">
          <Label className="text-lg font-semibold text-gray-700">
            Total Transactions: {totalTransactions}
          </Label>
          <Label className="text-lg font-semibold text-gray-700 ml-10">
            Total Amount: 
            <span className={`${totalAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalAmount >= 0 ? `+ $${totalAmount}` : `- $${Math.abs(totalAmount)}`}
            </span>
          </Label>
        </div>

        {/* Transactions Table */}
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
                  {/* Name */}
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {editing === transaction.id ? (
                      <Input
                        type="text"
                        value={editedTransaction.name || transaction.name}
                        onChange={(e) =>
                          setEditedTransaction({ ...editedTransaction, name: e.target.value })
                        }
                        className="border p-1 rounded"
                      />
                    ) : (
                      transaction.name
                    )}
                  </td>

                  {/* Amount */}
                  <td className={`px-4 py-2 text-sm ${transaction.category.toLowerCase() === "income" ? "text-green-600" : "text-red-600"}`}>
                    {editing === transaction.id ? (
                      <Input
                        type="number"
                        value={editedTransaction.amount || transaction.amount}
                        onChange={(e) =>
                          setEditedTransaction({ ...editedTransaction, amount: +e.target.value })
                        }
                        className="border p-1 rounded"
                      />
                    ) : (
                      transaction.category.toLowerCase() === "income"
                        ? `+ $${transaction.amount}`
                        : `- $${Math.abs(transaction.amount)}`
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {editing === transaction.id ? (
                      <Input
                        type="text"
                        value={editedTransaction.date || formatDate(transaction.date)}
                        disabled
                        className="border p-1 rounded"
                      />
                    ) : (
                      transaction.date
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {editing === transaction.id ? (
                      <select
                        value={editedTransaction.category || transaction.category}
                        onChange={(e) =>
                          setEditedTransaction({ ...editedTransaction, category: e.target.value })
                        }
                        className="border p-1 rounded"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    ) : (
                      transaction.category
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 text-sm">
                    {editing === transaction.id ? (
                      <button
                        onClick={saveEditedTransaction}
                        className="text-green-600 hover:underline mr-4"
                      >
                        <SaveIcon />
                      </button>
                    ) : (
                      <button
                        className="text-blue-600 hover:underline mr-4"
                        onClick={() => editTransaction(transaction.id)}
                      >
                        <PenBoxIcon />
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => deleteTransaction(transaction.id)}
                    >
                      <Trash2Icon />
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
