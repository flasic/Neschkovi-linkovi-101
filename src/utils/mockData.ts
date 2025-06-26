import { SensorData, ProductionData, ControlSystem, Alert, Farm, FinancialMetrics, MaintenanceTask } from '../types';
import { subDays, subHours } from 'date-fns';

export const generateMockData = () => {
  const farm: Farm = {
    id: '1',
    name: 'Sunrise Poultry Farm',
    location: 'Rural Valley, State',
    totalBirds: 15000,
    coopCount: 6,
    establishedDate: new Date('2020-03-15'),
    farmType: 'layers',
  };

  const sensorData: SensorData[] = [
    {
      id: '1',
      type: 'temperature',
      value: 22.5 + Math.random() * 3,
      unit: '°C',
      location: 'Coop A',
      timestamp: new Date(),
      status: 'normal',
    },
    {
      id: '2',
      type: 'humidity',
      value: 65 + Math.random() * 10,
      unit: '%',
      location: 'Coop A',
      timestamp: new Date(),
      status: 'normal',
    },
    {
      id: '3',
      type: 'temperature',
      value: 24.1 + Math.random() * 2,
      unit: '°C',
      location: 'Coop B',
      timestamp: new Date(),
      status: 'warning',
    },
    {
      id: '4',
      type: 'air_quality',
      value: 85 + Math.random() * 10,
      unit: 'AQI',
      location: 'Coop A',
      timestamp: new Date(),
      status: 'normal',
    },
    {
      id: '5',
      type: 'light',
      value: 300 + Math.random() * 100,
      unit: 'lux',
      location: 'Coop B',
      timestamp: new Date(),
      status: 'normal',
    },
  ];

  const productionData: ProductionData[] = Array.from({ length: 30 }, (_, i) => ({
    date: subDays(new Date(), 29 - i),
    eggsCollected: 12000 + Math.floor(Math.random() * 2000),
    feedConsumption: 1800 + Math.floor(Math.random() * 200),
    waterConsumption: 3500 + Math.floor(Math.random() * 500),
    mortality: Math.floor(Math.random() * 5),
    birdCount: 15000 - Math.floor(Math.random() * 50),
    avgWeight: 1.8 + Math.random() * 0.3,
  }));

  const controlSystems: ControlSystem[] = [
    {
      id: '1',
      name: 'Climate Control - Coop A',
      type: 'climate',
      status: 'active',
      isAutomated: true,
      currentValue: 22.5,
      targetValue: 23.0,
      unit: '°C',
      lastUpdated: new Date(),
    },
    {
      id: '2',
      name: 'Ventilation System',
      type: 'climate',
      status: 'active',
      isAutomated: true,
      currentValue: 75,
      targetValue: 80,
      unit: '%',
      lastUpdated: subHours(new Date(), 1),
    },
    {
      id: '3',
      name: 'LED Lighting Schedule',
      type: 'lighting',
      status: 'active',
      isAutomated: true,
      currentValue: 14,
      targetValue: 16,
      unit: 'hours',
      lastUpdated: new Date(),
    },
    {
      id: '4',
      name: 'Automatic Feeder',
      type: 'feeding',
      status: 'active',
      isAutomated: true,
      currentValue: 1850,
      targetValue: 1800,
      unit: 'kg',
      lastUpdated: subHours(new Date(), 2),
    },
    {
      id: '5',
      name: 'Water Supply System',
      type: 'water',
      status: 'active',
      isAutomated: true,
      currentValue: 3200,
      targetValue: 3500,
      unit: 'L',
      lastUpdated: new Date(),
    },
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'High Temperature Alert',
      message: 'Temperature in Coop B has exceeded optimal range (26.2°C)',
      timestamp: subHours(new Date(), 1),
      isRead: false,
      source: 'Temperature Sensor - Coop B',
      actionRequired: true,
    },
    {
      id: '2',
      type: 'info',
      title: 'Feed Level Low',
      message: 'Feed silo #2 is at 15% capacity. Schedule refill soon.',
      timestamp: subHours(new Date(), 3),
      isRead: false,
      source: 'Feed Management System',
      actionRequired: true,
    },
    {
      id: '3',
      type: 'critical',
      title: 'Water Pump Malfunction',
      message: 'Water pump in Coop C has stopped working. Immediate attention required.',
      timestamp: subHours(new Date(), 6),
      isRead: true,
      source: 'Water Management System',
      actionRequired: true,
    },
  ];

  const financialMetrics: FinancialMetrics = {
    revenue: 45000,
    expenses: 32000,
    profit: 13000,
    feedCost: 18000,
    medicationCost: 2500,
    utilityCost: 4500,
    laborCost: 7000,
    period: 'monthly',
  };

  const maintenanceTasks: MaintenanceTask[] = [
    {
      id: '1',
      title: 'Replace Air Filters',
      description: 'Replace HVAC air filters in all coops',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'John Smith',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      equipment: 'HVAC System',
      estimatedDuration: 120,
    },
    {
      id: '2',
      title: 'Water Line Inspection',
      description: 'Inspect and clean water lines in Coop A',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'Mike Johnson',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      equipment: 'Water System',
      estimatedDuration: 180,
    },
    {
      id: '3',
      title: 'Generator Testing',
      description: 'Monthly backup generator test and maintenance',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'Sarah Wilson',
      dueDate: subDays(new Date(), 2),
      completedDate: subDays(new Date(), 1),
      equipment: 'Backup Generator',
      estimatedDuration: 90,
    },
  ];

  return {
    farm,
    sensorData,
    productionData,
    controlSystems,
    alerts,
    financialMetrics,
    maintenanceTasks,
  };
};