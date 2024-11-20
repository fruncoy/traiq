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
  const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const updatedTasks = allTasks.map(t => t.id === task.id ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
  // Update user's active tasks - ensure we store the full task object
  const userActiveTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
  const existingTaskIndex = userActiveTasks.findIndex((t: Task) => t.id === updatedTask.id);
  
  if (existingTaskIndex === -1) {
    userActiveTasks.push(updatedTask);
  } else {
    userActiveTasks[existingTaskIndex] = updatedTask;
  }
  
  localStorage.setItem('userActiveTasks', JSON.stringify(userActiveTasks));
  console.log("Updated user active tasks:", userActiveTasks);

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
    id: `${submission.bidderId}-${Date.now()}`,
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

  // Remove from active tasks after submission
  const userActiveTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
  const updatedActiveTasks = userActiveTasks.filter((t: Task) => t.id !== task.id);
  localStorage.setItem('userActiveTasks', JSON.stringify(updatedActiveTasks));

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
  
  // Update user submissions
  const userSubmissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
  const updatedUserSubmissions = userSubmissions.map((s: any) => {
    if (s.taskId === taskId) {
      return { ...s, status: 'approved' };
    }
    return s;
  });
  localStorage.setItem('taskSubmissions', JSON.stringify(updatedUserSubmissions));
  
  // Update user earnings
  const userEarnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
  userEarnings[bidderId] = (userEarnings[bidderId] || 0) + taskerPayout;
  localStorage.setItem('userEarnings', JSON.stringify(userEarnings));
  
  // Update earnings history
  const earningsHistory = JSON.parse(localStorage.getItem('earningsHistory') || '{}');
  earningsHistory[bidderId] = (earningsHistory[bidderId] || 0) + taskerPayout;
  localStorage.setItem('earningsHistory', JSON.stringify(earningsHistory));
  
  // Add notification for approval
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.unshift({
    id: Date.now().toString(),
    title: "Task Approved",
    message: `Your submission for task ${task.code} has been approved! KES ${taskerPayout} has been added to your balance.`,
    type: "success",
    read: false,
    date: new Date().toISOString()
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  // Save updated tasks
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
  return task;
};