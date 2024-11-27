import React from "react";
import HeaderBox from "@/components/ui/HeaderBox";

interface Transaction {
  id: number;
  name: string;
  amount: number;
  date: string;
  category: string;
}

const TransactionHistory: React.FC = () => {

  const transactions: Transaction[] = [
    { id: 1, name: "Salary", amount: 3000, date: "2024-11-20", category: "Income" },
    { id: 2, name: "Groceries", amount: -150, date: "2024-11-21", category: "Expense" },
    { id: 3, name: "Savings Deposit", amount: 500, date: "2024-11-22", category: "Savings" },
    { id: 4, name: "Electricity Bill", amount: -100, date: "2024-11-23", category: "Expense" },
  ];

  return (
    <div className="home-content">
    <div className="p-4 bg-gray-50 rounded-md shadow-md">
      <header className='home-header'>
            <HeaderBox
              type="greeting"
              title="Transection History"
              subtext=""
            />
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
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount > 0 ? `+ $${transaction.amount}` : `- $${Math.abs(transaction.amount)}`}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{transaction.date}</td>
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
