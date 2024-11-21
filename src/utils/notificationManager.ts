import { toast } from "sonner";

export const checkDeadlines = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const now = new Date();
  
  tasks.forEach((task: any) => {
    const deadline = new Date(task.deadline);
    const timeLeft = deadline.getTime() - now.getTime();
    const hoursLeft = timeLeft / (1000 * 60 * 60);
    
    if (hoursLeft <= 24 && hoursLeft > 0 && !task.notified) {
      toast.warning(`Task ${task.code} is due in ${Math.floor(hoursLeft)} hours!`, {
        duration: 6000,
      });
      
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