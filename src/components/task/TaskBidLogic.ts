import { Task, TaskCategory } from "@/types/task";
import { toast } from "sonner";
import { 
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
  const bidsRequired = 1; // Each bid costs 1 point
  
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

  // Check if task should become active (has enough bids)
  if (task.currentBids >= task.bidsNeeded) {
    task.status = "active";
    // Select first 5 bidders for payment
    task.selectedTaskers = task.bidders.slice(0, 5);
    
    // Add notification for selected taskers
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    task.selectedTaskers.forEach(taskerId => {
      notifications.unshift({
        id: Date.now().toString(),
        title: "Task Assignment",
        message: `You've been selected for "${task.title}" (ID: ${task.code})`,
        type: "success",
        date: new Date().toISOString()
      });
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  // Update tasks in localStorage
  const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  // Add activity record
  const activities = JSON.parse(localStorage.getItem('activities') || '[]');
  activities.unshift({
    id: Date.now().toString(),
    type: task.status === "active" ? "approval" : "pending",
    message: task.status === "active" 
      ? `Task "${task.title}" (ID: ${task.code}) is now active with all required bids`
      : `New bid placed on task "${task.title}" (ID: ${task.code})`,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('activities', JSON.stringify(activities));

  // Add to user's active tasks immediately
  const userActiveTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
  userActiveTasks.push(task);
  localStorage.setItem('userActiveTasks', JSON.stringify(userActiveTasks));

  return task;
};

export const generateNewTask = (category?: TaskCategory): Task => {
  const popularityData = JSON.parse(localStorage.getItem('categoryPopularity') || '{}');
  const mostPopularCategory = Object.entries(popularityData)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] as TaskCategory || 'short_essay';

  const selectedCategory = category || mostPopularCategory;
  const payout = calculatePayout(selectedCategory);
  const taskerPayout = calculateTaskerPayout(selectedCategory);

  return {
    id: Date.now().toString(),
    code: generateUniqueTaskCode(),
    title: `${selectedCategory.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Task`,
    description: generateTaskDescription(selectedCategory),
    category: selectedCategory,
    payout,
    taskerPayout,
    platformFee: payout - taskerPayout,
    workingTime: selectedCategory === "long_essay" ? "2-3 hours" : "1-2 hours",
    bidsNeeded: 10, // All tasks require 10 bids
    currentBids: 0,
    datePosted: new Date().toISOString(),
    status: "pending",
    bidders: [],
    selectedTaskers: []
  };
};