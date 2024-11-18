import { Task, TaskCategory } from "@/types/task";
import { toast } from "sonner";
import { 
  calculateBidsRequired, 
  calculatePayout,
  calculateTaskerPayout,
  generateTaskDescription 
} from "@/utils/initializeData";

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
  if (!task) throw new Error("Task not found");

  const currentBids = parseInt(localStorage.getItem('userBids') || '0');
  const bidsRequired = calculateBidsRequired(task.category);
  
  if (currentBids < bidsRequired) throw new Error("insufficient_bids");
  if (task.bidders?.includes(userId)) throw new Error("already_bid");

  // Update category popularity
  const popularityData = JSON.parse(localStorage.getItem('categoryPopularity') || '{}');
  popularityData[task.category] = (popularityData[task.category] || 0) + 1;
  localStorage.setItem('categoryPopularity', JSON.stringify(popularityData));

  // Update user's bids
  localStorage.setItem('userBids', (currentBids - bidsRequired).toString());

  // Update task's current bids and bidders
  task.currentBids = (task.currentBids || 0) + 1;
  task.bidders = [...(task.bidders || []), userId];

  // Update user's earnings tracking
  const userEarnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
  if (!userEarnings[userId]) {
    userEarnings[userId] = {
      totalEarned: 0,
      pendingTasks: 0,
      completedTasks: 0,
      balance: 0
    };
  }
  userEarnings[userId].pendingTasks += 1;
  localStorage.setItem('userEarnings', JSON.stringify(userEarnings));

  // Immediately assign task to bidder
  const userTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
  const assignedTask = { ...task, status: "assigned" };
  userTasks.push(assignedTask);
  localStorage.setItem('userActiveTasks', JSON.stringify(userTasks));

  // Add notification
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.unshift({
    id: Date.now().toString(),
    title: "Task Assigned",
    message: `You have been assigned to "${task.title}"`,
    type: "success",
    date: new Date().toISOString()
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));

  // Remove task from available tasks list
  const updatedTasks = tasks.filter(t => t.id !== task.id);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  // Track payout in finance records
  const financeRecords = JSON.parse(localStorage.getItem('financeRecords') || '[]');
  financeRecords.unshift({
    id: Date.now().toString(),
    taskId: task.id,
    taskCode: task.code,
    amount: task.payout,
    type: 'pending',
    date: new Date().toISOString(),
    userId: userId
  });
  localStorage.setItem('financeRecords', JSON.stringify(financeRecords));

  return task;
};

export const generateNewTask = (category?: TaskCategory): Task => {
  const popularityData = JSON.parse(localStorage.getItem('categoryPopularity') || '{}');
  const mostPopularCategory = Object.entries(popularityData)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] as TaskCategory || 'short_essay';

  const selectedCategory = category || mostPopularCategory;
  const payout = calculatePayout(selectedCategory);
  const bidsRequired = calculateBidsRequired(selectedCategory);

  return {
    id: Date.now().toString(),
    code: generateUniqueTaskCode(),
    title: `${selectedCategory.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Task`,
    description: generateTaskDescription(selectedCategory),
    category: selectedCategory,
    payout,
    workingTime: selectedCategory === "long_essay" ? "2-3 hours" : "1-2 hours",
    bidsNeeded: 10,
    currentBids: 0,
    datePosted: new Date().toISOString(),
    bidders: [],
    selectedTaskers: []
  };
};