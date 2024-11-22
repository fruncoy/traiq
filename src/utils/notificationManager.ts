import { createNotification } from "./notificationUtils";

export const checkDeadlines = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const now = new Date();
  
  tasks.forEach((task: any) => {
    const deadline = new Date(task.deadline);
    const timeLeft = deadline.getTime() - now.getTime();
    const hoursLeft = timeLeft / (1000 * 60 * 60);
    
    if (hoursLeft <= 24 && hoursLeft > 0 && !task.notified) {
      // Instead of toast, create a notification
      const taskerId = task.bidders?.[0];
      if (taskerId) {
        const notifications = JSON.parse(localStorage.getItem(`notifications_${taskerId}`) || '[]');
        notifications.unshift({
          id: Date.now().toString(),
          title: 'Task Deadline Approaching',
          message: `Task ${task.code} is due in ${Math.floor(hoursLeft)} hours!`,
          type: 'warning',
          read: false,
          date: new Date().toISOString(),
          taskerId
        });
        localStorage.setItem(`notifications_${taskerId}`, JSON.stringify(notifications));
      }
      
      // Mark as notified
      task.notified = true;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  });
};

export const initializeNotifications = () => {
  // Check deadlines every 30 minutes
  setInterval(checkDeadlines, 30 * 60 * 1000);
  // Initial check
  checkDeadlines();
};