'use client';

import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import React from 'react';

Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  title: string;
  labels: string[];
  data: number[];
}

const PieChart: React.FC<PieChartProps> = ({ title, labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Jumlah',
        data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#8AC926', '#6A4C93',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="my-8 w-full max-w-md mx-auto">
      <h2 className="text-center text-lg font-semibold mb-4">{title}</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
