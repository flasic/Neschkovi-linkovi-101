export interface SensorData {
  id: string;
  type: 'temperature' | 'humidity' | 'air_quality' | 'light' | 'sound';
  value: number;
  unit: string;
  location: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

export interface ProductionData {
  date: Date;
  eggsCollected: number;
  feedConsumption: number;
  waterConsumption: number;
  mortality: number;
  birdCount: number;
  avgWeight: number;
}

export interface ControlSystem {
  id: string;
  name: string;
  type: 'climate' | 'lighting' | 'feeding' | 'water' | 'waste';
  status: 'active' | 'inactive' | 'maintenance';
  isAutomated: boolean;
  currentValue: number;
  targetValue: number;
  unit: string;
  lastUpdated: Date;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  source: string;
  actionRequired?: boolean;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  totalBirds: number;
  coopCount: number;
  establishedDate: Date;
  farmType: 'layers' | 'broilers' | 'mixed';
}

export interface FinancialMetrics {
  revenue: number;
  expenses: number;
  profit: number;
  feedCost: number;
  medicationCost: number;
  utilityCost: number;
  laborCost: number;
  period: 'daily' | 'weekly' | 'monthly';
}

export interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  equipment: string;
  estimatedDuration: number;
}