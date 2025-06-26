import React, { useState } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Volume2,
  MapPin,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { SensorData } from '../types';
import { formatDistanceToNow } from 'date-fns';

export const Monitoring: React.FC = () => {
  const { sensorData, refreshData } = useFarm();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const locations = Array.from(new Set(sensorData.map(sensor => sensor.location)));
  const filteredSensors = selectedLocation === 'all' 
    ? sensorData 
    : sensorData.filter(sensor => sensor.location === selectedLocation);

  const getSensorIcon = (type: SensorData['type']) => {
    switch (type) {
      case 'temperature':
        return Thermometer;
      case 'humidity':
        return Droplets;
      case 'air_quality':
        return Wind;
      case 'light':
        return Sun;
      case 'sound':
        return Volume2;
      default:
        return Thermometer;
    }
  };

  const getStatusColor = (status: SensorData['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'normal':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getValueColor = (status: SensorData['status']) => {
    switch (status) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'normal':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Environmental Monitoring</h1>
            <p className="text-gray-600 mt-1">
              Real-time sensor data from all farm locations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <button
              onClick={refreshData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSensors.map((sensor) => {
          const Icon = getSensorIcon(sensor.type);
          return (
            <div
              key={sensor.id}
              className={`rounded-xl shadow-sm p-6 border transition-all hover:shadow-md ${getStatusColor(sensor.status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Icon className={`w-6 h-6 ${getValueColor(sensor.status)}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {sensor.type.replace('_', ' ')}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {sensor.location}
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.status)}`}>
                  {sensor.status}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className={`text-3xl font-bold ${getValueColor(sensor.status)}`}>
                    {sensor.value.toFixed(1)}
                  </span>
                  <span className="text-lg text-gray-600">{sensor.unit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Last updated</span>
                <span>{formatDistanceToNow(sensor.timestamp, { addSuffix: true })}</span>
              </div>

              {/* Trend indicator */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+2.1% from yesterday</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Data Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">24-Hour Trends</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Historical trend charts will be displayed here</p>
            <p className="text-sm text-gray-400 mt-1">Integration with time-series database required</p>
          </div>
        </div>
      </div>
    </div>
  );
};