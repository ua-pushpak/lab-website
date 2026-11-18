import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      const res = await apiService.getAnalyticsStats(timeRange);
      setStats(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-spinner fa-spin text-4xl text-drone-blue"></i>
      </div>
    );
  }

  const lineData = {
    labels: Object.keys(stats?.dailyViews || {}),
    datasets: [
      {
        label: 'Page Views',
        data: Object.values(stats?.dailyViews || {}),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: Object.keys(stats?.pageViews || {}),
    datasets: [
      {
        label: 'Views per Page',
        data: Object.values(stats?.pageViews || {}),
        backgroundColor: '#0ea5e9',
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [
          stats?.deviceStats?.desktop || 0,
          stats?.deviceStats?.mobile || 0,
          stats?.deviceStats?.tablet || 0,
        ],
        backgroundColor: ['#0ea5e9', '#06b6d4', '#3b82f6'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === days
                  ? 'bg-drone-blue text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-drone-gray p-6 rounded-2xl">
          <div className="text-3xl font-bold text-drone-blue">{stats?.totalViews || 0}</div>
          <div className="text-gray-400 text-sm mt-1">Total Views</div>
        </div>
        <div className="bg-drone-gray p-6 rounded-2xl">
          <div className="text-3xl font-bold text-green-500">{stats?.totalUniqueVisitors || 0}</div>
          <div className="text-gray-400 text-sm mt-1">Unique Visitors</div>
        </div>
        <div className="bg-drone-gray p-6 rounded-2xl">
          <div className="text-3xl font-bold text-purple-500">{Object.keys(stats?.pageViews || {}).length}</div>
          <div className="text-gray-400 text-sm mt-1">Pages Tracked</div>
        </div>
        <div className="bg-drone-gray p-6 rounded-2xl">
          <div className="text-3xl font-bold text-yellow-500">{timeRange}</div>
          <div className="text-gray-400 text-sm mt-1">Days</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-drone-gray p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-4">Traffic Over Time</h3>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-drone-gray p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-4">Device Distribution</h3>
          <div className="h-64">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-drone-gray p-6 rounded-2xl">
        <h3 className="text-white font-semibold mb-4">Page Views</h3>
        <div className="h-64">
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;