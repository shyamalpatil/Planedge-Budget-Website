import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// Register components
ChartJS.register(ArcElement, Tooltip, Legend);

const CostBreakdownChart = () => {
  const location = useLocation();
  const { breakdown = [], totalCost = 0 } = location.state || {};

  const labels = breakdown.map((item) => item.head);
  const data = breakdown.map((item) => item.amount);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Cost Breakdown',
        data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#E7E9ED',
          '#36A2EB',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <Box sx={{ textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Total Estimation
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Box sx={{ textAlign: 'left', width: '40%' }}>
          <Typography variant="h6" color="green">
            Base Estimation: ₹{(totalCost * 0.8).toLocaleString('en-IN')}
          </Typography>
          <Typography variant="h6" color="green">
            Base Estimation with Finishing: ₹{(totalCost * 0.9).toLocaleString('en-IN')}
          </Typography>
          <Typography variant="h6" color="green">
            Base Estimation with Fittings & Finishing: ₹{(totalCost).toLocaleString('en-IN')}
          </Typography>
          <Typography variant="h6" color="red">
            Maximum Cost: ₹{(totalCost * 1.2).toLocaleString('en-IN')}
          </Typography>
        </Box>
        <Box sx={{ width: '50%' }}>
          <Pie data={chartData} options={options} />
        </Box>
      </Box>
    </Box>
  );
};

export default CostBreakdownChart;
