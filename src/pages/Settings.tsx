import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  Wifi,
  Smartphone,
  Save,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      farmName: 'Sunrise Poultry Farm',
      location: 'Rural Valley, State',
      timezone: 'America/New_York',
      language: 'en',
      currency: 'USD',
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      criticalAlertsOnly: false,
      maintenanceReminders: true,
      productionReports: true,
    },
    sensors: {
      temperatureThreshold: { min: 18, max: 25 },
      humidityThreshold: { min: 60, max: 75 },
      updateInterval: 30,
      dataRetention: 90,
    },
    
    security: {
      twoFactorAuth: false,
      sessionTimeout: 60,
      passwordExpiry: 90,
      auditLogging: true,
    },
    integration: {
      apiKey: 'sk-1234567890abcdef',
      webhookUrl: '',
      cloudSync: true,
      backupFrequency: 'daily',
    },
  });

  const handleSave = (section: string) => {
    // In a real app, this would save to backend
    toast.success(`${section} settings saved successfully`);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'sensors', label: 'Sensors', icon: Wifi },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integration', label: 'Integration', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <SettingsIcon className="w-7 h-7 mr-3 text-green-600" />
              System Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Configure your farm management system preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Farm Name
                      </label>
                      <input
                        type="text"
                        value={settings.general.farmName}
                        onChange={(e) => setSettings({
                          ...settings,
                          general: { ...settings.general, farmName: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={settings.general.location}
                        onChange={(e) => setSettings({
                          ...settings,
                          general: { ...settings.general, location: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timezone
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => setSettings({
                          ...settings,
                          general: { ...settings.general, timezone: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        value={settings.general.currency}
                        onChange={(e) => setSettings({
                          ...settings,
                          general: { ...settings.general, currency: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD (C$)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('general')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {key === 'emailAlerts' && 'Receive alerts via email'}
                            {key === 'smsAlerts' && 'Receive alerts via SMS'}
                            {key === 'pushNotifications' && 'Browser push notifications'}
                            {key === 'criticalAlertsOnly' && 'Only critical alerts'}
                            {key === 'maintenanceReminders' && 'Maintenance task reminders'}
                            {key === 'productionReports' && 'Daily production reports'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                [key]: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('notifications')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Sensor Settings */}
            {activeTab === 'sensors' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Sensor Configuration</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Temperature Thresholds (°C)</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                          <input
                            type="number"
                            value={settings.sensors.temperatureThreshold.min}
                            onChange={(e) => setSettings({
                              ...settings,
                              sensors: {
                                ...settings.sensors,
                                temperatureThreshold: {
                                  ...settings.sensors.temperatureThreshold,
                                  min: Number(e.target.value)
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                          <input
                            type="number"
                            value={settings.sensors.temperatureThreshold.max}
                            onChange={(e) => setSettings({
                              ...settings,
                              sensors: {
                                ...settings.sensors,
                                temperatureThreshold: {
                                  ...settings.sensors.temperatureThreshold,
                                  max: Number(e.target.value)
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Humidity Thresholds (%)</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                          <input
                            type="number"
                            value={settings.sensors.humidityThreshold.min}
                            onChange={(e) => setSettings({
                              ...settings,
                              sensors: {
                                ...settings.sensors,
                                humidityThreshold: {
                                  ...settings.sensors.humidityThreshold,
                                  min: Number(e.target.value)
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                          <input
                            type="number"
                            value={settings.sensors.humidityThreshold.max}
                            onChange={(e) => setSettings({
                              ...settings,
                              sensors: {
                                ...settings.sensors,
                                humidityThreshold: {
                                  ...settings.sensors.humidityThreshold,
                                  max: Number(e.target.value)
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Update Interval (seconds)
                        </label>
                        <input
                          type="number"
                          value={settings.sensors.updateInterval}
                          onChange={(e) => setSettings({
                            ...settings,
                            sensors: { ...settings.sensors, updateInterval: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data Retention (days)
                        </label>
                        <input
                          type="number"
                          value={settings.sensors.dataRetention}
                          onChange={(e) => setSettings({
                            ...settings,
                            sensors: { ...settings.sensors, dataRetention: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('sensors')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, twoFactorAuth: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, sessionTimeout: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password Expiry (days)
                        </label>
                        <input
                          type="number"
                          value={settings.security.passwordExpiry}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, passwordExpiry: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Audit Logging</h3>
                        <p className="text-sm text-gray-600">Log all system activities</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.auditLogging}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, auditLogging: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('security')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Integration Settings */}
            {activeTab === 'integration' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration & API</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="password"
                          value={settings.integration.apiKey}
                          onChange={(e) => setSettings({
                            ...settings,
                            integration: { ...settings.integration, apiKey: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        value={settings.integration.webhookUrl}
                        onChange={(e) => setSettings({
                          ...settings,
                          integration: { ...settings.integration, webhookUrl: e.target.value }
                        })}
                        placeholder="https://your-webhook-url.com/endpoint"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Cloud Synchronization</h3>
                        <p className="text-sm text-gray-600">Sync data with cloud storage</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.integration.cloudSync}
                          onChange={(e) => setSettings({
                            ...settings,
                            integration: { ...settings.integration, cloudSync: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Backup Frequency
                      </label>
                      <select
                        value={settings.integration.backupFrequency}
                        onChange={(e) => setSettings({
                          ...settings,
                          integration: { ...settings.integration, backupFrequency: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('integration')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};