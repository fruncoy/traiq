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
  if (!task) throw new Error("Task not found");

  const currentBids = parseInt(localStorage.getItem('userBids') || '0');
  const bidsRequired = 1;
  
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

  // Check if task has reached required bids
  if (task.currentBids >= task.bidsNeeded) {
    task.status = "completed";
    console.log(`Task reached ${task.bidsNeeded} bids, marking as completed`);
  }

  // Update tasks in localStorage
  const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  return task;
};

export const processTaskSubmission = async (task: Task) => {
  console.log("Processing task submission...");
  
  // Wait 30-40 seconds before processing payment
  const delay = Math.floor(Math.random() * (40000 - 30000) + 30000);
  
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Randomly select 5 bidders for payment
  const shuffledBidders = task.bidders.sort(() => Math.random() - 0.5);
  task.selectedTaskers = shuffledBidders.slice(0, 5);
  
  // Calculate payout based on task type
  const taskerPayout = task.bidsNeeded * 40 * 1.25; // bidsNeeded * 40 * 1.25
  
  // Add notification for selected taskers
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  task.selectedTaskers.forEach(taskerId => {
    notifications.unshift({
      id: Date.now().toString(),
      title: "Payment Processed",
      message: `Your submission for "${task.title}" (ID: ${task.code}) has been approved. Payment of KES ${taskerPayout} processed`,
      type: "success",
      date: new Date().toISOString()
    });
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));

  // Update user earnings for selected taskers
  const userEarnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
  task.selectedTaskers.forEach(taskerId => {
    userEarnings[taskerId] = (userEarnings[taskerId] || 0) + taskerPayout;
  });
  localStorage.setItem('userEarnings', JSON.stringify(userEarnings));
  
  console.log("Task payment processed after delay");
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
  const taskerPayout = bidsNeeded * 40 * 1.25; // bidsNeeded * 40 * 1.25

  return {
    id: Date.now().toString(),
    code: generateUniqueTaskCode(),
    title: `${selectedCategory.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Task`,
    description: generateTaskDescription(selectedCategory),
    category: selectedCategory,
    payout,
    taskerPayout,
    platformFee: payout - taskerPayout,
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