export const resetSystem = () => {
  // Clear all localStorage data
  localStorage.clear();
  
  // Reinitialize with default values and tasks
  localStorage.setItem('userBids', '5'); // Start with 5 bids
  localStorage.setItem('tasks', '[]');
  localStorage.setItem('userActiveTasks', '[]');
  localStorage.setItem('activeTasks', '[]');
  localStorage.setItem('taskSubmissions', '[]');
  localStorage.setItem('notifications', '[]');
  localStorage.setItem('activities', '[]');
  localStorage.setItem('categoryPopularity', '{}');
  localStorage.setItem('totalSpent', '0');
  localStorage.setItem('potentialEarnings', '0');
  localStorage.setItem('userEarnings', '{}');
  localStorage.setItem('financeRecords', '[]');
};