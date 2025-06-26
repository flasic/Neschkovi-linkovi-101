import React, { useState } from 'react';
import { 
  Power, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  Thermometer,
  Sun,
  Droplets,
  Wind
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { ControlSystem } from '../types';
import toast from 'react-hot-toast';

export const Controls: React.FC = () => {
  const { controlSystems, updateControlSystem } = useFarm();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  const handleToggleSystem = (system: ControlSystem) => {
    const newStatus = system.status === 'active' ? 'inactive' : 'active';
    updateControlSystem(system.id, { status: newStatus });
    toast.success(`${system.name} ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const handleToggleAutomation = (system: ControlSystem) => {
    updateControlSystem(system.id, { isAutomated: !system.isAutomated });
    toast.success(`Automation ${!system.isAutomated ? 'enabled' : 'disabled'} for ${system.name}`);
  };

  const handleValueChange = (system: ControlSystem, newValue: number) => {
    updateControlSystem(system.id, { targetValue: newValue });
    toast.success(`Target value updated for ${system.name}`);
  };

  const getSystemIcon = (type: ControlSystem['type']) => {
    switch (type) {
      case 'climate':
        return Thermometer;
      case 'lighting':
        return Sun;
      case 'feeding':
        return Droplets;
      case 'water':
        return Droplets;
      case 'waste':
        return Wind;
      default:
        return Settings;
    }
  };

  const getStatusColor = (status: ControlSystem['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'inactive':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const groupedSystems = controlSystems.reduce((acc, system) => {
    if (!acc[system.type]) {
      acc[system.type] = [];
    }
    acc[system.type].push(system);
    return acc;
  }, {} as Record<string, ControlSystem[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Controls</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all automated farm systems
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              {controlSystems.filter(s => s.status === 'active').length} Active
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              {controlSystems.filter(s => s.status === 'inactive').length} Inactive
            </div>
          </div>
        </div>
      </div>

      {/* Control Systems by Category */}
      {Object.entries(groupedSystems).map(([type, systems]) => (
        <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 capitalize flex items-center">
              {React.createElement(getSystemIcon(type as ControlSystem['type']), {
                className: "w-5 h-5 mr-2"
              })}
              {type.replace('_', ' ')} Systems
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {systems.map((system) => {
                const Icon = getSystemIcon(system.type);
                return (
                  <div
                    key={system.id}
                    className={`rounded-lg border p-6 transition-all hover:shadow-md ${getStatusColor(system.status)}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{system.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{system.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleAutomation(system)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            system.isAutomated
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {system.isAutomated ? 'Auto' : 'Manual'}
                        </button>
                        <button
                          onClick={() => handleToggleSystem(system)}
                          className={`p-2 rounded-lg transition-colors ${
                            system.status === 'active'
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {system.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Current Value</span>
                        <span className="text-lg font-bold text-gray-900">
                          {system.currentValue} {system.unit}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">Target Value</label>
                          <span className="text-sm text-gray-600">{system.targetValue} {system.unit}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={system.targetValue}
                          onChange={(e) => handleValueChange(system, Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          disabled={system.status !== 'active'}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last updated: {system.lastUpdated.toLocaleTimeString()}</span>
                        <button
                          onClick={() => setSelectedSystem(selectedSystem === system.id ? null : system.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedSystem === system.id ? 'Hide Details' : 'Show Details'}
                        </button>
                      </div>

                      {selectedSystem === system.id && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">System Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">System ID:</span>
                              <span className="font-mono">{system.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="capitalize">{system.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Automation:</span>
                              <span className={system.isAutomated ? 'text-green-600' : 'text-gray-600'}>
                                {system.isAutomated ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Reset
                            </button>
                            <button className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                              <Settings className="w-3 h-3 mr-1" />
                              Configure
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Emergency Controls */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <Power className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-900">Emergency Controls</h2>
            <p className="text-sm text-red-700">Use these controls only in emergency situations</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Emergency Stop All Systems
          </button>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            Activate Backup Power
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Open All Ventilation
          </button>
        </div>
      </div>
    </div>
  );
};