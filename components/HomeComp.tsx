'use client';

import React, { useEffect, useState } from 'react';
import HeaderBox from '@/components/ui/HeaderBox';
import TotalBalanceBox from '@/components/ui/TotalBalanceBox';

const HomeComp = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/fetch-transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data.transactions || []);
  
        // Calculate balance: add income and subtract expenses
        const balance = (data.transactions || []).reduce(
          (acc: number, transaction: any) => {
            const amount = parseFloat(transaction.amount) || 0; // Ensure amount is parsed as a number
            const category = transaction.category.toLowerCase();
  
            // If the transaction is income, add the amount
            if (category === 'income') {
              return acc + amount;
            }
  
            // If the transaction is expense, subtract the amount
            if (category === 'expense') {
              return acc - amount;
            }
  
            return acc;
          },
          0
        );
  
        setTotalBalance(balance);
      } catch (err: any) {
        setError(err.message || 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTransactions();
  }, []);
  
  return (
    <header className="home-header">
      <HeaderBox
        type="greeting"
        title="Welcome"
        user={'User'} // Replace with dynamic user if available
        subtext="Access and manage your transactions efficiently"
      />
      <TotalBalanceBox
        accounts={transactions} // Pass transactions if needed
        totalBanks={1} // Replace with dynamic data if applicable
        totalCurrentBalance={totalBalance}
      />
      {loading ? (
        <p className="text-gray-600 mt-4">Loading transactions...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">Error: {error}</p>
      ) : (
        <p className="text-gray-600 mt-4">Transactions fetched successfully.</p>
      )}
    </header>
  );
};

export default HomeComp;
