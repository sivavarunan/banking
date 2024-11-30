"use client";

import HeaderBox from "@/components/ui/HeaderBox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

const AddTransaction = () => {
  const [transaction, setTransaction] = useState({
    name: "",
    amount: "",
    date: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/add-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json(); 
      console.log('Transaction added successfully:', data);
  
      setTransaction({ name: '', amount: '', date: '', category: '' }); 
    } catch (err: any) {
      console.error('Error submitting transaction:', err.message);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="home-content">
      <div className="h-full w-full justify-center items-center">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
          <header className="home-header">
            <HeaderBox
              type="title"
              title="Add Transactions"
              subtext="Add your transaction efficiently"
            />
          </header>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 mt-10">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Name
            </Label>
            <Input
              type="text"
              name="name"
              value={transaction.name}
              onChange={handleChange}
              placeholder="Enter transaction name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </Label>
            <Input
              type="number"
              name="amount"
              value={transaction.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </Label>
            <Input
              type="date"
              name="date"
              value={transaction.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </Label>
            <select
              name="category"
              value={transaction.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
