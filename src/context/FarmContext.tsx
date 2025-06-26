import React, { createContext, useContext, useState, useEffect } from 'react';
import { SensorData, ProductionData, ControlSystem, Alert, Farm, FinancialMetrics, MaintenanceTask } from '../types';
import { generateMockData } from '../utils/mockData';

interface FarmContextType {
  farm: Farm;
  sensorData: SensorData[];
  productionData: ProductionData[];
  controlSystems: ControlSystem[];
  alerts: Alert[];
  financialMetrics: FinancialMetrics;
  maintenanceTasks: MaintenanceTask[];
  updateControlSystem: (id: string, updates: Partial<ControlSystem>) => void;
  markAlertAsRead: (id: string) => void;
  addMaintenanceTask: (task: Omit<MaintenanceTask, 'id'>) => void;
  updateMaintenanceTask: (id: string, updates: Partial<MaintenanceTask>) => void;
  refreshData: () => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farmData, setFarmData] = useState(() => generateMockData());

  const updateControlSystem = (id: string, updates: Partial<ControlSystem>) => {
    setFarmData(prev => ({
      ...prev,
      controlSystems: prev.controlSystems.map(system =>
        system.id === id ? { ...system, ...updates, lastUpdated: new Date() } : system
      )
    }));
  };

  const markAlertAsRead = (id: string) => {
    setFarmData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    }));
  };

  const addMaintenanceTask = (task: Omit<MaintenanceTask, 'id'>) => {
    const newTask: MaintenanceTask = {
      ...task,
      id: crypto.randomUUID(),
    };
    setFarmData(prev => ({
      ...prev,
      maintenanceTasks: [...prev.maintenanceTasks, newTask]
    }));
  };

  const updateMaintenanceTask = (id: string, updates: Partial<MaintenanceTask>) => {
    setFarmData(prev => ({
      ...prev,
      maintenanceTasks: prev.maintenanceTasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  };

  const refreshData = () => {
    // Simulate real-time data updates
    setFarmData(prev => {
      const newData = generateMockData();
      return {
        ...prev,
        sensorData: newData.sensorData,
        productionData: [...prev.productionData.slice(-29), ...newData.productionData.slice(-1)],
      };
    });
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(refreshData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <FarmContext.Provider value={{
      farm: farmData.farm,
      sensorData: farmData.sensorData,
      productionData: farmData.productionData,
      controlSystems: farmData.controlSystems,
      alerts: farmData.alerts,
      financialMetrics: farmData.financialMetrics,
      maintenanceTasks: farmData.maintenanceTasks,
      updateControlSystem,
      markAlertAsRead,
      addMaintenanceTask,
      updateMaintenanceTask,
      refreshData,
    }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (context === undefined) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};