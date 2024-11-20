import { Task, TaskSubmission } from "@/types/task";
import { startOfWeek, endOfWeek, isAfter, isBefore, setHours } from "date-fns";

export const handleTaskBid = async (
  task: Task, 
  userBids: number,
  tasks: Task[],
  userId: string = 'current-user-id'
) => {
  if (!task) throw new Error("Task not found");

  if (task.currentBids >= task.maxBidders) {
    throw new Error("Task has reached maximum bidders");
  }

  const currentBids = parseInt(localStorage.getItem('userBids') || '0');
  const bidsRequired = task.category === 'genai' ? 10 : 5;
  
  if (currentBids < bidsRequired) throw new Error("insufficient_bids");
  
  localStorage.setItem('userBids', (currentBids - bidsRequired).toString());

  task.currentBids = (task.currentBids || 0) + 1;
  task.bidders = [...(task.bidders || []), userId];
  
  const userActiveTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
  const updatedTask = { ...task, status: "active" };
  userActiveTasks.push(updatedTask);
  localStorage.setItem('userActiveTasks', JSON.stringify(userActiveTasks));

  const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  return updatedTask;
};

export const processTaskSubmission = async (task: Task, submission: TaskSubmission) => {
  const now = new Date();
  const deadline = setHours(new Date(task.deadline), 16); // 4 PM deadline

  if (isAfter(now, deadline)) {
    throw new Error("Task submission deadline (4 PM) has passed");
  }

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
  
  const userSubmissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
  userSubmissions.push({
    id: submission.bidderId + Date.now(),
    taskId: task.id,
    taskTitle: task.title,
    taskCode: task.code,
    fileName: submission.fileName,
    status: 'pending',
    submittedAt: new Date().toISOString()
  });
  localStorage.setItem('taskSubmissions', JSON.stringify(userSubmissions));
  
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.unshift({
    id: Date.now().toString(),
    title: "Task Submitted",
    message: `Your submission for task ${task.code} is pending review`,
    type: "info",
    read: false,
    date: new Date().toISOString()
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
};

export const approveSubmission = async (taskId: string, bidderId: string) => {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const task = tasks.find((t: Task) => t.id === taskId);
  
  if (!task) throw new Error("Task not found");
  
  // Get total revenue from bid purchases for current week
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  const totalRevenue = parseFloat(localStorage.getItem('totalSpent') || '0');
  
  // Calculate current week's approved payouts
  const approvedPayouts = tasks.reduce((total: number, t: Task) => {
    const approvedSubmissions = t.submissions?.filter(s => {
      const submissionDate = new Date(s.submittedAt || '');
      return s.status === 'approved' && 
             submissionDate >= weekStart && 
             submissionDate <= weekEnd;
    }) || [];
    return total + (approvedSubmissions.length * (t.category === 'genai' ? 400 : 200));
  }, 0);
  
  // Calculate new total including this submission
  const taskerPayout = task.category === 'genai' ? 400 : 200;
  const newTotal = approvedPayouts + taskerPayout;
  
  // Check if there's enough revenue
  if (newTotal > totalRevenue) {
    throw new Error("Insufficient revenue for payout. Current week's payouts would exceed revenue.");
  }
  
  // Update task submission status
  const updatedTasks = tasks.map((t: Task) => {
    if (t.id === taskId) {
      const updatedSubmissions = t.submissions?.map(s => {
        if (s.bidderId === bidderId) {
          return { ...s, status: 'approved' };
        }
        return s;
      });
      return { ...t, submissions: updatedSubmissions };
    }
    return t;
  });
  
  // Update user earnings
  const userEarnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
  userEarnings[bidderId] = (userEarnings[bidderId] || 0) + taskerPayout;
  localStorage.setItem('userEarnings', JSON.stringify(userEarnings));
  
  // Update earnings history
  const earningsHistory = JSON.parse(localStorage.getItem('earningsHistory') || '{}');
  earningsHistory[bidderId] = (earningsHistory[bidderId] || 0) + taskerPayout;
  localStorage.setItem('earningsHistory', JSON.stringify(earningsHistory));
  
  // Save updated tasks
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
  return task;
};

export const resetWeeklyTasks = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  
  // Archive current week's tasks
  const archivedTasks = JSON.parse(localStorage.getItem('archivedTasks') || '[]');
  const tasksToArchive = tasks.filter((task: Task) => {
    const taskDate = new Date(task.datePosted);
    const weekStart = startOfWeek(new Date());
    return isBefore(taskDate, weekStart);
  });
  
  // Add to archive
  archivedTasks.push(...tasksToArchive);
  localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
  
  // Remove old tasks
  const currentTasks = tasks.filter((task: Task) => {
    const taskDate = new Date(task.datePosted);
    const weekStart = startOfWeek(new Date());
    return !isBefore(taskDate, weekStart);
  });
  
  localStorage.setItem('tasks', JSON.stringify(currentTasks));
  localStorage.setItem('totalSpent', '0'); // Reset weekly revenue
};
