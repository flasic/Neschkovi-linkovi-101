import React from 'react';
import { AlertTriangle, Info, AlertCircle, Clock } from 'lucide-react';
import { Alert } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useFarm } from '../context/FarmContext';

interface AlertsListProps {
  alerts: Alert[];
}

export const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
  const { markAlertAsRead } = useFarm();

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return AlertTriangle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Info;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
        <span className="text-sm text-gray-500">{alerts.length} alerts</span>
      </div>
      
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No recent alerts</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                  alert.isRead ? 'opacity-60' : ''
                } ${getAlertColor(alert.type)}`}
                onClick={() => !alert.isRead && markAlertAsRead(alert.id)}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </h4>
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-current rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                      <span className="mx-2">•</span>
                      <span>{alert.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};