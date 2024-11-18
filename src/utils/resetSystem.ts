export const resetSystem = () => {
  // Clear all localStorage data
  localStorage.removeItem('tasks');
  localStorage.removeItem('userBids');
  localStorage.removeItem('userActiveTasks');
  localStorage.removeItem('activeTasks');
  localStorage.removeItem('taskSubmissions');
  localStorage.removeItem('notifications');
  localStorage.removeItem('activities');
  localStorage.removeItem('categoryPopularity');
  localStorage.removeItem('totalSpent');
  localStorage.removeItem('potentialEarnings');
  localStorage.removeItem('userEarnings');
  localStorage.removeItem('financeRecords');
  
  // Reinitialize with default values
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