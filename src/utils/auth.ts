export const getCurrentTasker = () => {
  const taskerData = sessionStorage.getItem('currentTasker');
  return taskerData ? JSON.parse(taskerData) : null;
};

export const updateCurrentTasker = (taskerData: any) => {
  // Update in sessionStorage
  sessionStorage.setItem('currentTasker', JSON.stringify(taskerData));
  
  // Also update in taskers list in localStorage
  const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
  const index = taskers.findIndex((t: any) => t.id === taskerData.id);
  if (index !== -1) {
    taskers[index] = taskerData;
    localStorage.setItem('taskers', JSON.stringify(taskers));
  }
};

export const logoutTasker = () => {
  sessionStorage.removeItem('currentTasker');
};