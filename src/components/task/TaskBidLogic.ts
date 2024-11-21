import { Task, TaskSubmission } from "@/types/task";
import { startOfWeek, endOfWeek, isAfter, isBefore, setHours } from "date-fns";

const CURRENT_USER_ID = 'current-user-id'; // We'll use this constant throughout the file

export const handleTaskBid = async (
  task: Task, 
  userBids: number,
  tasks: Task[],
  userId: string = CURRENT_USER_ID
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
  console.log("Processing submission for task:", task.title);
  
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

  // Create a new submission with unique ID and consistent user ID
  const newSubmission = {
    ...submission,
    id: `${CURRENT_USER_ID}-${Date.now()}`,
    bidderId: CURRENT_USER_ID,
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
    message: `Your submission for task ${task.title} is pending review`,
    type: "info",
    read: false,
    date: new Date().toISOString()
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
};
