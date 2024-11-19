import { initializeDefaultTasks } from "./initializeData";

export const resetSystem = () => {
  // Clear all localStorage data
  localStorage.clear();
  
  // Initialize new tasks and default values
  initializeDefaultTasks();
};