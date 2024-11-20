import { Task, TaskSubmission } from "@/types/task";
import { startOfWeek, endOfWeek, isAfter, isBefore, setHours } from "date-fns";

export const handleTaskBid = async (
  task: Task, 
  userBids: number,
  tasks: Task[],
  userId: string = 'current-user-id'
) => {
  if (!task) throw new Error("Task not found");
  console.log("Processing bid for task:", task.code);

  const currentBids = parseInt(localStorage.getItem('userBids') || '0');
  const bidsRequired = task.category === 'genai' ? 10 : 5;
  
  if (currentBids < bidsRequired) throw new Error("insufficient_bids");
  
  localStorage.setItem('userBids', (currentBids - bidsRequired).toString());

  // Update task bidding info
  const updatedTask = {
    ...task,
    currentBids: (task.currentBids || 0) + 1,
    bidders: [...(task.bidders || []), userId],
    status: "active"
  };
  
  // Update tasks in localStorage
  const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  console.log("Updated tasks after bid:", updatedTasks);

  // Update user's active tasks
  const userActiveTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
  userActiveTasks.push(updatedTask);
  localStorage.setItem('userActiveTasks', JSON.stringify(userActiveTasks));

  return updatedTask;
};

export const processTaskSubmission = async (task: Task, submission: TaskSubmission) => {
  console.log("Processing submission for task:", task.code);
  
  const now = new Date();
  const deadline = setHours(new Date(task.deadline), 16);

  if (isAfter(now, deadline)) {
    throw new Error("Task submission deadline (4 PM) has passed");
  }

  // Get all tasks and update the specific task's submissions
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const taskToUpdate = tasks.find((t: Task) => t.id === task.id);
  
  if (!taskToUpdate) {
    console.error("Task not found for submission:", task.id);
    throw new Error("Task not found");
  }

  // Create a new submission with unique ID
  const newSubmission = {
    ...submission,
    id: `${submission.bidderId}-${Date.now()}`, // Ensure unique ID
    submittedAt: new Date().toISOString()
  };

  // Update task submissions
  const updatedTasks = tasks.map((t: Task) => {
    if (t.id === task.id) {
      return {
        ...t,
        submissions: [...(t.submissions || []), newSubmission]
      };
    }
    return t;
  });
  
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  console.log("Updated tasks after submission:", updatedTasks);

  // Update user submissions separately
  const userSubmissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
  const userSubmission = {
    id: newSubmission.id,
    taskId: task.id,
    taskTitle: task.title,
    taskCode: task.code,
    fileName: submission.fileName,
    status: 'pending',
    submittedAt: newSubmission.submittedAt
  };
  
  userSubmissions.push(userSubmission);
  localStorage.setItem('taskSubmissions', JSON.stringify(userSubmissions));
  console.log("Updated user submissions:", userSubmissions);

  // Add notification
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
  
  // Calculate payout amount based on task category
  const taskerPayout = task.category === 'genai' ? 700 : 300;
  
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
