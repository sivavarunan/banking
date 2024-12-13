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
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : transactions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map((transaction: any) => {
            const isIncome = transaction.category.toLowerCase() === 'income';
            return (
              <div
                key={transaction.$id}
                className={`bg-white shadow-lg rounded-lg p-4 border border-gray-200 transform transition-transform hover:scale-105 hover:shadow-2xl ${
                  isIncome
                    ? 'border-emerald-500 shadow-green-300 bg-emerald-50'
                    : 'border-red-500 shadow-red-300 bg-orange-50'
                }`}
              >
                <h3 className="font-medium text-gray-800">{transaction.name || 'Unknown Name'}</h3>
                <p className="text-sm text-gray-500">{transaction.category || 'Uncategorized'}</p>
                <p className="text-sm text-gray-500">
                  {transaction.date
                    ? new Date(transaction.date).toLocaleDateString()
                    : 'Unknown Date'}
                </p>
                <p
                  className={`text-lg font-semibold mt-2 ${
                    isIncome ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isIncome ? '+' : '-'}${transaction.amount || '0.00'}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">No transactions found</p>
      )}
    </section>
  );
};

export default RecentTransactions;
