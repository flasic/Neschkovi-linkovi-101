import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Calendar, 
  User, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { MaintenanceTask } from '../types';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export const Maintenance: React.FC = () => {
  const { maintenanceTasks, addMaintenanceTask, updateMaintenanceTask } = useFarm();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'overdue'>('all');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as MaintenanceTask['priority'],
    assignedTo: '',
    dueDate: '',
    equipment: '',
    estimatedDuration: 60,
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.dueDate) {
      toast.error('Please fill in required fields');
      return;
    }

    addMaintenanceTask({
      ...newTask,
      status: 'pending',
      dueDate: new Date(newTask.dueDate),
    });

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
      equipment: '',
      estimatedDuration: 60,
    });
    setShowAddForm(false);
    toast.success('Maintenance task added successfully');
  };

  const handleUpdateTaskStatus = (taskId: string, status: MaintenanceTask['status']) => {
    const updates: Partial<MaintenanceTask> = { status };
    if (status === 'completed') {
      updates.completedDate = new Date();
    }
    updateMaintenanceTask(taskId, updates);
    toast.success(`Task marked as ${status.replace('_', ' ')}`);
  };

  const getStatusIcon = (status: MaintenanceTask['status']) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in_progress':
        return Clock;
      case 'overdue':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: MaintenanceTask['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'overdue':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getPriorityColor = (priority: MaintenanceTask['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = maintenanceTasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'overdue') {
      return task.status !== 'completed' && new Date(task.dueDate) < new Date();
    }
    return task.status === filter;
  });

  const taskCounts = {
    all: maintenanceTasks.length,
    pending: maintenanceTasks.filter(t => t.status === 'pending').length,
    in_progress: maintenanceTasks.filter(t => t.status === 'in_progress').length,
    completed: maintenanceTasks.filter(t => t.status === 'completed').length,
    overdue: maintenanceTasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Wrench className="w-7 h-7 mr-3 text-green-600" />
              Maintenance Management
            </h1>
            <p className="text-gray-600 mt-1">
              Schedule and track maintenance tasks for all farm equipment
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Task Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'all', label: 'All Tasks' },
            { key: 'pending', label: 'Pending' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' },
            { key: 'overdue', label: 'Overdue' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label} ({taskCounts[key as keyof typeof taskCounts]})
            </button>
          ))}
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Maintenance Task</h2>
          <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment
              </label>
              <input
                type="text"
                value={newTask.equipment}
                onChange={(e) => setNewTask({ ...newTask, equipment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as MaintenanceTask['priority'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <input
                type="text"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                value={newTask.estimatedDuration}
                onChange={(e) => setNewTask({ ...newTask, estimatedDuration: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                min="1"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No maintenance tasks</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "No maintenance tasks scheduled."
                : `No ${filter.replace('_', ' ')} tasks found.`}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const StatusIcon = getStatusIcon(task.status);
            const isOverdue = task.status !== 'completed' && new Date(task.dueDate) < new Date();
            const actualStatus = isOverdue ? 'overdue' : task.status;
            
            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${getStatusColor(actualStatus)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(actualStatus)}`}>
                          {actualStatus.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 mb-3">{task.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {task.assignedTo || 'Unassigned'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Due: {format(task.dueDate, 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {task.estimatedDuration} minutes
                        </div>
                        <div className="flex items-center">
                          <Wrench className="w-4 h-4 mr-2" />
                          {task.equipment || 'General'}
                        </div>
                      </div>
                      
                      {task.completedDate && (
                        <div className="mt-2 text-sm text-green-600">
                          Completed: {formatDistanceToNow(task.completedDate, { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        Start
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        Complete
                      </button>
                    )}
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Maintenance Statistics */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{taskCounts.all}</div>
            <div className="text-sm text-gray-700">Total Tasks</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{taskCounts.pending}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{taskCounts.in_progress}</div>
            <div className="text-sm text-blue-700">In Progress</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{taskCounts.completed}</div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{taskCounts.overdue}</div>
            <div className="text-sm text-red-700">Overdue</div>
          </div>
        </div>
      </div>
    </div>
  );
};