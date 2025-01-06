'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const totalIncome = accounts
    .filter((transaction: any) => transaction.category.toLowerCase() === 'income')
    .reduce((acc: number, transaction: any) => acc + (parseFloat(transaction.amount) || 0), 0);

  const totalExpense = accounts
    .filter((transaction: any) => transaction.category.toLowerCase() === 'expense')
    .reduce((acc: number, transaction: any) => acc + (parseFloat(transaction.amount) || 0), 0);

  const data = {
    datasets: [
      {
        label: 'Income vs Expense',
        data: [totalIncome, totalExpense],
        backgroundColor: ['#24b339', '#f52249'],
      },
    ],
    labels: ["Income", "Expense"],
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: '60%',
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: $${value.toLocaleString()}`;
              },
            },
          },
          legend: {
            display: false,
            position: 'bottom',
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
