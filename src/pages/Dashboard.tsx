import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Egg, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  DollarSign,
  Users
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { MetricCard } from '../components/MetricCard';
import { ChartCard } from '../components/ChartCard';
import { AlertsList } from '../components/AlertsList';
import { RecentActivity } from '../components/RecentActivity';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { sensorData, productionData, alerts, financialMetrics } = useFarm();

  const latestProduction = productionData[productionData.length - 1];
  const avgTemp = sensorData
    .filter(sensor => sensor.type === 'temperature')
    .reduce((sum, sensor) => sum + sensor.value, 0) / 
    sensorData.filter(sensor => sensor.type === 'temperature').length;

  const avgHumidity = sensorData
    .filter(sensor => sensor.type === 'humidity')
    .reduce((sum, sensor) => sum + sensor.value, 0) / 
    sensorData.filter(sensor => sensor.type === 'humidity').length;

  const criticalAlerts = alerts.filter(alert => alert.type === 'critical' && !alert.isRead).length;

  const eggProductionData = productionData.slice(-7).map(data => ({
    date: format(data.date, 'MMM dd'),
    eggs: data.eggsCollected,
    feed: data.feedConsumption,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Farm Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Real-time overview of your poultry farm operations
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Average Temperature"
          value={`${avgTemp.toFixed(1)}°C`}
          icon={Thermometer}
          trend={{ value: 2.1, isPositive: true }}
          status={avgTemp > 25 ? 'warning' : 'normal'}
        />
        <MetricCard
          title="Humidity Level"
          value={`${avgHumidity.toFixed(1)}%`}
          icon={Droplets}
          trend={{ value: -1.5, isPositive: false }}
          status="normal"
        />
        <MetricCard
          title="Daily Egg Production"
          value={latestProduction?.eggsCollected.toLocaleString() || '0'}
          icon={Egg}
          trend={{ value: 5.2, isPositive: true }}
          status="normal"
        />
        <MetricCard
          title="Active Alerts"
          value={criticalAlerts.toString()}
          icon={AlertTriangle}
          status={criticalAlerts > 0 ? 'critical' : 'normal'}
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Egg Production Trend"
          subtitle="Last 7 days"
          data={eggProductionData}
          dataKey="eggs"
          color="#10B981"
        />
        <ChartCard
          title="Feed Consumption"
          subtitle="Last 7 days"
          data={eggProductionData}
          dataKey="feed"
          color="#F59E0B"
        />
      </div>

      {/* Financial Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">Revenue</p>
                <p className="text-2xl font-bold text-green-700">
                  ${financialMetrics.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-900">Expenses</p>
                <p className="text-2xl font-bold text-red-700">
                  ${financialMetrics.expenses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">Profit</p>
                <p className="text-2xl font-bold text-blue-700">
                  ${financialMetrics.profit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-900">Profit Margin</p>
                <p className="text-2xl font-bold text-purple-700">
                  {((financialMetrics.profit / financialMetrics.revenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsList alerts={alerts.slice(0, 5)} />
        <RecentActivity />
      </div>
    </div>
  );
};