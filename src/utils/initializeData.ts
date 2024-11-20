import { Task, TaskCategory } from "@/types/task";

export const initializeDefaultTasks = () => {
  // Reset the system with empty tasks
  localStorage.clear();
  
  // Initialize with empty data
  localStorage.setItem('tasks', '[]');
  localStorage.setItem('archivedTasks', '[]');
  localStorage.setItem('userBids', '0');
  localStorage.setItem('userActiveTasks', '[]');
  localStorage.setItem('activeTasks', '[]');
  localStorage.setItem('taskSubmissions', '[]');
  localStorage.setItem('notifications', '[]');
  localStorage.setItem('activities', '[]');
  localStorage.setItem('totalSpent', '0');
  localStorage.setItem('userEarnings', '{}');
  localStorage.setItem('earningsHistory', '{}');
};