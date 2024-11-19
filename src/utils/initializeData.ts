import { Task, TaskCategory } from "@/types/task";

export const initializeDefaultTasks = () => {
  // Reset the system with empty tasks
  localStorage.clear();
  
  // Initialize with empty data
  localStorage.setItem('tasks', '[]');
  localStorage.setItem('userBids', '0'); // Start with 0 bids
  localStorage.setItem('userActiveTasks', '[]');
  localStorage.setItem('activeTasks', '[]');
  localStorage.setItem('taskSubmissions', '[]');
  localStorage.setItem('notifications', '[]');
  localStorage.setItem('activities', '[]');
  localStorage.setItem('totalSpent', '0');
  localStorage.setItem('potentialEarnings', '0');
  localStorage.setItem('userEarnings', '{}');
  localStorage.setItem('financeRecords', '[]');
};