import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  Check, 
  X,
  Filter,
  Search
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { Alert } from '../types';
import { formatDistanceToNow } from 'date-fns';

export const Alerts: React.FC = () => {
  const { alerts, markAlertAsRead } = useFarm();
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'warning' | 'info'>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getIconColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !alert.isRead) ||
      (filter === alert.type);
    
    const matchesSearch = searchTerm === '' || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.type === 'critical' && !alert.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="w-7 h-7 mr-3 text-green-600" />
              Alerts & Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage all farm alerts and system notifications
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                {criticalCount} Critical
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                {unreadCount} Unread
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All', count: alerts.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'critical', label: 'Critical', count: alerts.filter(a => a.type === 'critical').length },
                { key: 'warning', label: 'Warning', count: alerts.filter(a => a.type === 'warning').length },
                { key: 'info', label: 'Info', count: alerts.filter(a => a.type === 'info').length },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You're all caught up! No alerts to display."
                : `No ${filter} alerts found.`}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${
                  alert.isRead ? 'opacity-75' : ''
                } ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-white shadow-sm ${getIconColor(alert.type)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {alert.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.type}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{alert.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
                        <span>•</span>
                        <span>{alert.source}</span>
                        {alert.actionRequired && (
                          <>
                            <span>•</span>
                            <span className="text-red-600 font-medium">Action Required</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!alert.isRead && (
                          <button
                            onClick={() => markAlertAsRead(alert.id)}
                            className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark as Read
                          </button>
                        )}
                        {alert.actionRequired && (
                          <button className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                            Take Action
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alert Statistics */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.type === 'critical').length}
            </div>
            <div className="text-sm text-red-700">Critical Alerts</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {alerts.filter(a => a.type === 'warning').length}
            </div>
            <div className="text-sm text-yellow-700">Warning Alerts</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {alerts.filter(a => a.type === 'info').length}
            </div>
            <div className="text-sm text-blue-700">Info Alerts</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.isRead).length}
            </div>
            <div className="text-sm text-green-700">Resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
};