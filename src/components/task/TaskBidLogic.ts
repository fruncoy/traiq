import { Task, TaskSubmission } from "@/types/task";
import { startOfWeek, endOfWeek, isAfter, isBefore, setHours } from "date-fns";

export const handleTaskBid = async (
  task: Task, 
  userBids: number,
  tasks: Task[],
) => {
  if (!task) throw new Error("Task not found");
  console.log("Processing bid for task:", task.code, "User bids:", userBids);

  const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');
  if (!currentTasker.id) throw new Error("No tasker logged in");

  // Get all taskers and find current tasker
  const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
  const taskerIndex = taskers.findIndex((t: any) => t.id === currentTasker.id);
  
  if (taskerIndex === -1) throw new Error("Tasker not found");
  
  const bidsRequired = task.category === 'genai' ? 10 : 5;
  console.log("Bids required:", bidsRequired, "Current user bids:", taskers[taskerIndex].bids);
  
  // Check if tasker has enough bids
  if (taskers[taskerIndex].bids < bidsRequired) {
    throw new Error("insufficient_bids");
  }

  // Check if tasker has already bid on this task
  if (task.bidders?.includes(currentTasker.id)) {
    throw new Error("already_bid");
  }
  
  // Update tasker's bids
  taskers[taskerIndex].bids -= bidsRequired;
  localStorage.setItem('taskers', JSON.stringify(taskers));
  localStorage.setItem('currentTasker', JSON.stringify(taskers[taskerIndex]));

  // Update task bidding info
  const updatedTask = {
    ...task,
    currentBids: (task.currentBids || 0) + 1,
    bidders: [...(task.bidders || []), currentTasker.id],
    status: "active"
  };
  
  // Update tasks in localStorage
  const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const updatedTasks = allTasks.map((t: Task) => t.id === task.id ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
  // Update user's active tasks
  const userActiveTasks = JSON.parse(localStorage.getItem(`userActiveTasks_${currentTasker.id}`) || '[]');
  const existingTaskIndex = userActiveTasks.findIndex((t: Task) => t.id === updatedTask.id);
  
  if (existingTaskIndex === -1) {
    userActiveTasks.push(updatedTask);
  } else {
    userActiveTasks[existingTaskIndex] = updatedTask;
  }
  
  localStorage.setItem(`userActiveTasks_${currentTasker.id}`, JSON.stringify(userActiveTasks));

  // Track bid activity for admin
  const activities = JSON.parse(localStorage.getItem('activities') || '[]');
  activities.unshift({
    id: Date.now().toString(),
    type: 'bid',
    message: `Tasker ${currentTasker.username} bid on task ${task.code}`,
    timestamp: new Date().toISOString(),
    taskerId: currentTasker.id
  });
  localStorage.setItem('activities', JSON.stringify(activities));

  return updatedTask;
};

export const processTaskSubmission = async (task: Task, submission: TaskSubmission) => {
  console.log("Processing submission for task:", task.title);
  
  const now = new Date();
  const deadline = setHours(new Date(task.deadline), 16);

  if (isAfter(now, deadline)) {
    throw new Error("Task submission deadline (4 PM) has passed");
  }

  const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');
  if (!currentTasker.id) throw new Error("No tasker logged in");

  // Get all tasks and update the specific task's submissions
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const taskToUpdate = tasks.find((t: Task) => t.id === task.id);
  
  if (!taskToUpdate) {
    console.error("Task not found for submission:", task.id);
    throw new Error("Task not found");
  }

  // Create a new submission with unique ID and tasker ID
  const newSubmission = {
    ...submission,
    id: `${currentTasker.id}-${Date.now()}`,
    bidderId: currentTasker.id,
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
  const userSubmissions = JSON.parse(localStorage.getItem(`taskSubmissions_${currentTasker.id}`) || '[]');
  const userSubmission = {
    id: newSubmission.id,
    taskId: task.id,
    taskTitle: task.title,
    fileName: submission.fileName,
    status: 'pending',
    submittedAt: newSubmission.submittedAt,
    bidderId: currentTasker.id
  };
  
  userSubmissions.push(userSubmission);
  localStorage.setItem(`taskSubmissions_${currentTasker.id}`, JSON.stringify(userSubmissions));

  // Remove from active tasks after submission
  const userActiveTasks = JSON.parse(localStorage.getItem(`userActiveTasks_${currentTasker.id}`) || '[]');
  const updatedActiveTasks = userActiveTasks.filter((t: Task) => t.id !== task.id);
  localStorage.setItem(`userActiveTasks_${currentTasker.id}`, JSON.stringify(updatedActiveTasks));

  // Add notification
  const notifications = JSON.parse(localStorage.getItem(`notifications_${currentTasker.id}`) || '[]');
  notifications.unshift({
    id: Date.now().toString(),
    title: "Task Submitted",
    message: `Your submission for task ${task.title} is pending review`,
    type: "info",
    read: false,
    date: new Date().toISOString()
  });
  localStorage.setItem(`notifications_${currentTasker.id}`, JSON.stringify(notifications));

  // Track submission activity for admin
  const activities = JSON.parse(localStorage.getItem('activities') || '[]');
  activities.unshift({
    id: Date.now().toString(),
    type: 'submission',
    message: `Tasker ${currentTasker.username} submitted task ${task.code}`,
    timestamp: new Date().toISOString(),
    taskerId: currentTasker.id
  });
  localStorage.setItem('activities', JSON.stringify(activities));
};