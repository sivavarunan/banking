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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Category</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction: any, index) => (
                <tr
                  key={transaction.$id}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="px-4 py-2 text-sm text-gray-700">{transaction.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{transaction.category}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    ${transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No transactions found</p>
      )}
    </section>
  );
};

export default RecentTransactions;
