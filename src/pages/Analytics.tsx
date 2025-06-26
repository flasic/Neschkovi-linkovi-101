import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { format, subDays } from 'date-fns';

export const Analytics: React.FC = () => {
  const { productionData, financialMetrics } = useFarm();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'production' | 'financial' | 'efficiency'>('production');

  const getFilteredData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return productionData.slice(-days);
  };

  const filteredData = getFilteredData();

  // Production Analytics
  const productionChartData = filteredData.map(data => ({
    date: format(data.date, 'MMM dd'),
    eggs: data.eggsCollected,
    feed: data.feedConsumption,
    water: data.waterConsumption,
    mortality: data.mortality,
  }));

  // Feed Conversion Ratio
  const fcrData = filteredData.map(data => ({
    date: format(data.date, 'MMM dd'),
    fcr: (data.feedConsumption / (data.eggsCollected * 0.06)).toFixed(2), // Assuming 60g per egg
  }));

  // Financial breakdown
  const financialBreakdown = [
    { name: 'Feed Cost', value: financialMetrics.feedCost, color: '#F59E0B' },
    { name: 'Labor Cost', value: financialMetrics.laborCost, color: '#10B981' },
    { name: 'Utility Cost', value: financialMetrics.utilityCost, color: '#3B82F6' },
    { name: 'Medication', value: financialMetrics.medicationCost, color: '#8B5CF6' },
  ];

  // Key Performance Indicators
  const totalEggs = filteredData.reduce((sum, data) => sum + data.eggsCollected, 0);
  const avgDailyProduction = totalEggs / filteredData.length;
  const totalFeed = filteredData.reduce((sum, data) => sum + data.feedConsumption, 0);
  const avgFCR = totalFeed / (totalEggs * 0.06);
  const totalMortality = filteredData.reduce((sum, data) => sum + data.mortality, 0);
  const mortalityRate = (totalMortality / (filteredData[0]?.birdCount || 1)) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive analysis of farm performance and trends
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex space-x-2">
            {[
              { key: 'production', label: 'Production', icon: TrendingUp },
              { key: 'financial', label: 'Financial', icon: PieChart },
              { key: 'efficiency', label: 'Efficiency', icon: BarChart3 },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key as any)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  selectedMetric === key
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Daily Production</p>
              <p className="text-2xl font-bold text-gray-900">{avgDailyProduction.toLocaleString()}</p>
              <p className="text-xs text-gray-500">eggs per day</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Feed Conversion Ratio</p>
              <p className="text-2xl font-bold text-gray-900">{avgFCR.toFixed(2)}</p>
              <p className="text-xs text-gray-500">kg feed / kg eggs</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mortality Rate</p>
              <p className="text-2xl font-bold text-gray-900">{mortalityRate.toFixed(2)}%</p>
              <p className="text-xs text-gray-500">last {timeRange}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <PieChart className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900">
                {((financialMetrics.profit / financialMetrics.revenue) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">this month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts based on selected metric */}
      {selectedMetric === 'production' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Egg Production Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="eggs" stroke="#10B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feed & Water Consumption</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="feed" fill="#F59E0B" />
                  <Bar dataKey="water" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {selectedMetric === 'financial' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip />
                  <RechartsPieChart data={financialBreakdown} cx="50%" cy="50%" outerRadius={80}>
                    {financialBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {financialBreakdown.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-medium text-green-900">Total Revenue</span>
                <span className="text-2xl font-bold text-green-700">
                  ${financialMetrics.revenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <span className="font-medium text-red-900">Total Expenses</span>
                <span className="text-2xl font-bold text-red-700">
                  ${financialMetrics.expenses.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-900">Net Profit</span>
                <span className="text-2xl font-bold text-blue-700">
                  ${financialMetrics.profit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMetric === 'efficiency' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feed Conversion Ratio</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fcrData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="fcr" stroke="#8B5CF6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mortality Tracking</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="mortality" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};