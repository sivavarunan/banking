'use client';

import React, { useEffect, useState } from 'react';
import HeaderBox from '@/components/ui/HeaderBox';
import TotalBalanceBox from '@/components/ui/TotalBalanceBox';
import { getLoggedInUser } from '@/lib/actions/user.actions';

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

        const balance = (data.transactions || []).reduce(
          (acc: number, transaction: any) => {
            const amount = parseFloat(transaction.amount) || 0;
            const category = transaction.category.toLowerCase();

            if (category === 'income') {
              return acc + amount;
            }

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
    <div>
      <TotalBalanceBox
        accounts={transactions}
        totalBanks={transactions.length}
        totalCurrentBalance={totalBalance}
      />
      {loading ? (
        <p className="text-gray-600 mt-4">Loading transactions...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">Error: {error}</p>
      ) : (
        <p className="text-gray-600 mt-4"></p>
      )}
    </div>
  );
};

export default HomeComp;
