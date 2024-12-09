'use client'
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
    <section className="recent-transactions">
      <h2>Recent Transactions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-text">Error: {error}</p>
      ) : transactions.length > 0 ? (
        <ul className="transaction-list">
          {transactions.map((transaction: any) => (
            <li key={transaction.$id} className="transaction-item">
              <div>
                <p><strong>{transaction.name}</strong></p>
                <p>{transaction.category}</p>
                <p>{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p>${transaction.amount}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found</p>
      )}
    </section>
  );
};

export default RecentTransactions;
