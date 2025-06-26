import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Printer,
  Mail,
  Share2
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const Reports: React.FC = () => {
  const { productionData, financialMetrics, farm } = useFarm();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const generateReport = () => {
    // This would typically generate and download a PDF report
    console.log('Generating report...', { reportType, selectedDate });
  };

  const getReportData = () => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (reportType) {
      case 'daily':
        startDate = selectedDate;
        endDate = selectedDate;
        break;
      case 'weekly':
        startDate = startOfWeek(selectedDate);
        endDate = endOfWeek(selectedDate);
        break;
      case 'monthly':
        startDate = startOfMonth(selectedDate);
        endDate = endOfMonth(selectedDate);
        break;
    }

    const filteredData = productionData.filter(
      data => data.date >= startDate && data.date <= endDate
    );

    const totalEggs = filteredData.reduce((sum, data) => sum + data.eggsCollected, 0);
    const totalFeed = filteredData.reduce((sum, data) => sum + data.feedConsumption, 0);
    const totalWater = filteredData.reduce((sum, data) => sum + data.waterConsumption, 0);
    const totalMortality = filteredData.reduce((sum, data) => sum + data.mortality, 0);
    const avgWeight = filteredData.reduce((sum, data) => sum + data.avgWeight, 0) / filteredData.length;

    return {
      period: `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`,
      totalEggs,
      totalFeed,
      totalWater,
      totalMortality,
      avgWeight: avgWeight || 0,
      avgDailyProduction: totalEggs / filteredData.length || 0,
      feedConversionRatio: totalFeed / (totalEggs * 0.06) || 0,
      mortalityRate: (totalMortality / (filteredData[0]?.birdCount || 1)) * 100,
    };
  };

  const reportData = getReportData();

  const reportTemplates = [
    {
      id: 'production',
      name: 'Production Report',
      description: 'Comprehensive egg production and feed consumption analysis',
      icon: FileText,
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue, expenses, and profitability analysis',
      icon: FileText,
    },
    {
      id: 'health',
      name: 'Health & Mortality Report',
      description: 'Bird health indicators and mortality tracking',
      icon: FileText,
    },
    {
      id: 'efficiency',
      name: 'Efficiency Report',
      description: 'Feed conversion ratio and operational efficiency metrics',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">
              Generate comprehensive reports for farm performance analysis
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
            </select>
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Report Preview</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={generateReport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Report Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{farm.name}</h1>
            <p className="text-gray-600">{farm.location}</p>
            <p className="text-lg font-semibold text-gray-800 mt-2 capitalize">
              {reportType} Production Report
            </p>
            <p className="text-gray-600">{reportData.period}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-blue-900">Total Egg Production</h3>
              <p className="text-2xl font-bold text-blue-700">{reportData.totalEggs.toLocaleString()}</p>
              <p className="text-sm text-blue-600">eggs</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-green-900">Average Daily Production</h3>
              <p className="text-2xl font-bold text-green-700">{reportData.avgDailyProduction.toFixed(0)}</p>
              <p className="text-sm text-green-600">eggs/day</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-yellow-900">Feed Conversion Ratio</h3>
              <p className="text-2xl font-bold text-yellow-700">{reportData.feedConversionRatio.toFixed(2)}</p>
              <p className="text-sm text-yellow-600">kg feed/kg eggs</p>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Eggs Collected:</span>
                  <span className="font-semibold">{reportData.totalEggs.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Daily Production:</span>
                  <span className="font-semibold">{reportData.avgDailyProduction.toFixed(0)} eggs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Bird Weight:</span>
                  <span className="font-semibold">{reportData.avgWeight.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Mortality:</span>
                  <span className="font-semibold">{reportData.totalMortality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mortality Rate:</span>
                  <span className="font-semibold">{reportData.mortalityRate.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Consumption</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Feed Consumed:</span>
                  <span className="font-semibold">{reportData.totalFeed.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Water Consumed:</span>
                  <span className="font-semibold">{reportData.totalWater.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Feed Conversion Ratio:</span>
                  <span className="font-semibold">{reportData.feedConversionRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Feed Cost:</span>
                  <span className="font-semibold">${financialMetrics.feedCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Water Cost:</span>
                  <span className="font-semibold">${financialMetrics.utilityCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-xl font-bold text-green-600">${financialMetrics.revenue.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Expenses</p>
                <p className="text-xl font-bold text-red-600">${financialMetrics.expenses.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-xl font-bold text-blue-600">${financialMetrics.profit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTemplates.map((template) => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <template.icon className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <button className="text-green-600 hover:text-green-700">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};