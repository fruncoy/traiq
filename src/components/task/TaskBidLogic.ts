import { Task, TaskCategory } from "@/types/task";
import { toast } from "sonner";
import { generateTaskDescription } from "@/utils/initializeData";

const generateUniqueTaskCode = () => {
  const prefix = 'TSK';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const handleTaskBid = async (
  task: Task, 
  userBids: number,
  tasks: Task[],
  userId: string = 'current-user-id'
) => {
  console.log("Handling bid for task:", task.id);
  
  if (!task) throw new Error("Task not found");

  const currentBids = parseInt(localStorage.getItem('userBids') || '0');
  const bidsRequired = 1;
  
  if (currentBids < bidsRequired) throw new Error("insufficient_bids");
  
  // Check if user has already bid on this task
  const userActiveTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
  if (userActiveTasks.some((t: Task) => t.id === task.id)) {
    throw new Error("already_bid");
  }

  // Update user's bids
  localStorage.setItem('userBids', (currentBids - bidsRequired).toString());

  // Update task's current bids and bidders
  task.currentBids = (task.currentBids || 0) + 1;
  task.bidders = [...(task.bidders || []), userId];
  
  // Add task to user's active tasks
  const updatedTask = { ...task, status: "active" };
  userActiveTasks.push(updatedTask);
  localStorage.setItem('userActiveTasks', JSON.stringify(userActiveTasks));

  // Update tasks in localStorage
  const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  console.log("Task bid successful:", {
    taskId: task.id,
    currentBids: task.currentBids,
    userActiveTasks: userActiveTasks.length
  });

  return updatedTask;
};

export const processTaskSubmission = async (task: Task) => {
  console.log("Processing task submission for:", task.id);
  
  // Wait 2-3 seconds before processing payment
  const delay = Math.floor(Math.random() * (3000 - 2000) + 2000);
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Calculate payout based on task type
  const taskerPayout = task.payout === 1000 ? 500 : 250; // 1000 KES -> 500, 500 KES -> 250
  
  // Add notification
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.unshift({
    id: Date.now().toString(),
    title: "Payment Processed",
    message: `Your submission for task ${task.code} has been approved. Payment of KES ${taskerPayout} processed.`,
    type: "success",
    date: new Date().toISOString()
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));

  // Update user earnings
  const userEarnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
  const userId = 'current-user-id';
  userEarnings[userId] = (userEarnings[userId] || 0) + taskerPayout;
  localStorage.setItem('userEarnings', JSON.stringify(userEarnings));
  
  console.log("Task payment processed:", {
    taskId: task.id,
    payout: taskerPayout
  });
  
  return task;
};

export const generateNewTask = (category?: TaskCategory): Task => {
  const popularityData = JSON.parse(localStorage.getItem('categoryPopularity') || '{}');
  const mostPopularCategory = Object.entries(popularityData)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] as TaskCategory || 'short_essay';

  const selectedCategory = category || mostPopularCategory;
  const isLongEssay = selectedCategory === 'long_essay';
  const payout = isLongEssay ? 1000 : 500;
  const bidsNeeded = isLongEssay ? 10 : 5;

  return {
    id: Date.now().toString(),
    code: generateUniqueTaskCode(),
    title: `${selectedCategory.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Task`,
    description: generateTaskDescription(selectedCategory),
    category: selectedCategory,
    payout,
    taskerPayout: payout === 1000 ? 500 : 250,
    platformFee: payout / 2,
    workingTime: isLongEssay ? "2-3 hours" : "1-2 hours",
    bidsNeeded,
    currentBids: 0,
    datePosted: new Date().toISOString(),
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    bidders: [],
    selectedTaskers: [],
    rating: 0,
    totalRatings: 0
  };
};

// Reset system data
export const resetSystem = () => {
  console.log("Resetting system data");
  localStorage.clear();
  localStorage.setItem('userBids', '5');
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