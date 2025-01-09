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

  const totalAmount = transactions.reduce((sum, transaction) => {
    return transaction.category.toLowerCase() === "income"
      ? sum + transaction.amount
      : sum - transaction.amount;
  }, 0);

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

  const editTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setEditedTransaction({ ...transaction, date: new Date().toISOString() });
      setEditing(id);
    }
  };

  const saveEditedTransaction = async () => {
    if (!editing || !editedTransaction.name || !editedTransaction.amount) {
      setError("Please fill in all fields before saving.");
      return;
    }

    try {
      const updatedTransaction = {
        name: editedTransaction.name,
        amount: editedTransaction.amount,
        category: editedTransaction.category || "income",
        date: editedTransaction.date || new Date().toISOString(),
      };

      const response = await fetch("/api/fetch-transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, data: updatedTransaction }),
      });

      if (!response.ok) {
        throw Error;
      }

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === editing
            ? { ...transaction, ...updatedTransaction, date: formatDate(updatedTransaction.date) }
            : transaction
        )
      );
      setEditing(null);
      setEditedTransaction({});
    } catch (err: any) {
      setError(err.message || "Failed to update transaction");
    }
  };

  const retryFetchTransactions = () => {
    setLoading(true);
    setError(null);
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600"><Loading /></div>;
  }

  if (error) {
    return <Error error={error} reset={retryFetchTransactions} />;
  }

  return (
    <div className="home-content">
      <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg">
        <header className="mb-6">
          <HeaderBox type="greeting" title="Transaction History" subtext="" />
          <div className="flex flex-wrap justify-between items-center mt-4 space-y-4 sm:space-y-0">
            <Label className="text-lg sm:text-xl font-semibold text-gray-800">
              Total Transactions: <span className="ml-2 text-indigo-600">{totalTransactions}</span>
            </Label>
            <Label className="text-lg sm:text-xl font-semibold text-gray-800">
              Total Amount:{" "}
              <span className={`${totalAmount >= 0 ? "text-green-600" : "text-red-600"} ml-2`}>
                {totalAmount >= 0 ? `+$${totalAmount}` : `-$${Math.abs(totalAmount)}`}
              </span>
            </Label>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-lg transition-all hover:border-indigo-500 hover:shadow-indigo-300/50">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                {["Name", "Amount", "Date", "Category", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={`border-b border-gray-300 transition-all hover:shadow-md hover:bg-gray-50 ${transaction.category.toLowerCase() === "income" ? "bg-emerald-50" : "bg-orange-50"}`}
                >
 <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-800 truncate">
        {editing === transaction.id ? (
          <Input
            type="text"
            value={editedTransaction.name || transaction.name}
            onChange={(e) =>
              setEditedTransaction({
                ...editedTransaction,
                name: e.target.value,
              })
            }
            className="border border-gray-300 rounded p-2 w-full"
          />
        ) : (
          transaction.name
        )}
      </td>

      {/* Amount */}
      <td
        className={`px-4 sm:px-6 py-4 text-xs sm:text-sm ${
          transaction.category.toLowerCase() === "income"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {editing === transaction.id ? (
          <Input
            type="number"
            value={editedTransaction.amount || transaction.amount}
            onChange={(e) =>
              setEditedTransaction({
                ...editedTransaction,
                amount: +e.target.value,
              })
            }
            className="border border-gray-300 rounded p-2 w-full"
          />
        ) : transaction.category.toLowerCase() === "income" ? (
          `+ $${transaction.amount}`
        ) : (
          `- $${Math.abs(transaction.amount)}`
        )}
      </td>

      {/* Date */}
      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
        {editing === transaction.id ? (
          <Input
            type="text"
            value={editedTransaction.date || formatDate(transaction.date)}
            disabled
            className="border border-gray-300 rounded p-2 w-full"
          />
        ) : (
          transaction.date
        )}
      </td>

      {/* Category */}
      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
        {editing === transaction.id ? (
          <select
            value={editedTransaction.category || transaction.category}
            onChange={(e) =>
              setEditedTransaction({
                ...editedTransaction,
                category: e.target.value,
              })
            }
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        ) : (
          transaction.category
        )}
      </td>

      {/* Actions */}
      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
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
