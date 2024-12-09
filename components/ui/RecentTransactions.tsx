'use client';
import React, { useEffect, useState } from 'react';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/fetch-transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <section className="recent-transactions p-6 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : transactions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map((transaction: any) => (
            <div
              key={transaction.$id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <h3 className="font-medium text-gray-800">{transaction.name}</h3>
              <p className="text-sm text-gray-500">{transaction.category}</p>
              <p className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                ${transaction.amount}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No transactions found</p>
      )}
    </section>
  );
};

export default RecentTransactions;
