import React from 'react';
import { Activity, Thermometer, Droplets, Zap, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const activities = [
  {
    id: '1',
    type: 'system',
    title: 'Climate Control Adjusted',
    description: 'Temperature set to 23°C in Coop A',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    icon: Thermometer,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    id: '2',
    type: 'maintenance',
    title: 'Water System Maintenance',
    description: 'Completed water line cleaning in Coop B',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: Droplets,
    color: 'text-green-600 bg-green-50',
  },
  {
    id: '3',
    type: 'alert',
    title: 'Power Backup Activated',
    description: 'Backup generator started due to power outage',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    icon: Zap,
    color: 'text-yellow-600 bg-yellow-50',
  },
  {
    id: '4',
    type: 'system',
    title: 'Feed Schedule Updated',
    description: 'Automatic feeder schedule modified',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    icon: Settings,
    color: 'text-purple-600 bg-purple-50',
  },
];

export const RecentActivity: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900">
                {activity.title}
              </h4>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};