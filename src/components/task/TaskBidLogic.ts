import { Task, TaskSubmission } from "@/types/task";

export const handleTaskBid = async (
  task: Task, 
  userBids: number,
  tasks: Task[],
  userId: string = 'current-user-id'
) => {
  if (!task) throw new Error("Task not found");

  const currentBids = parseInt(localStorage.getItem('userBids') || '0');
  const bidsRequired = task.payout === 1000 ? 10 : 5;
  
  if (currentBids < bidsRequired) throw new Error("insufficient_bids");
  
  // Update user's bids
  localStorage.setItem('userBids', (currentBids - bidsRequired).toString());

  // Update task's current bids and bidders
  task.currentBids = 1;
  task.bidders = [...(task.bidders || []), userId];
  
  // Add task to user's active tasks
  const userActiveTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
  const updatedTask = { ...task, status: "active" };
  userActiveTasks.push(updatedTask);
  localStorage.setItem('userActiveTasks', JSON.stringify(userActiveTasks));

  // Update tasks in localStorage
  const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  return updatedTask;
};

export const processTaskSubmission = async (task: Task, submission: TaskSubmission) => {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const updatedTasks = tasks.map((t: Task) => {
    if (t.id === task.id) {
      return {
        ...t,
        submissions: [...(t.submissions || []), submission]
      };
    }
    return t;
  });
  
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.unshift({
    id: Date.now().toString(),
    title: "Task Submitted",
    message: `Your submission for task ${task.code} is pending review`,
    type: "info",
    date: new Date().toISOString()
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  return task;
};