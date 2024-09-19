import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Chart = ({ data, indexAxis }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      datalabels: {
        color: 'gray',
        anchor: 'end',
        align: 'right',
        formatter: Math.round,
        font: {
          weight: 'bold'
        }
      },
      title: {
        display: false
      },
    },
    indexAxis: indexAxis || 'y'
  };

  return (
    <div>
      <Bar options={options} data={data} />
    </div>
  )
}

export default Chart
