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
  const bidsRequired = 1;
  
  if (currentBids < bidsRequired) throw new Error("insufficient_bids");
  if (task.bidders?.includes(userId)) throw new Error("already_bid");

  // Check if task has expired
  const deadline = new Date(task.deadline);
  if (deadline < new Date()) {
    throw new Error("task_expired");
  }

  // Update category popularity
  const popularityData = JSON.parse(localStorage.getItem('categoryPopularity') || '{}');
  popularityData[task.category] = (popularityData[task.category] || 0) + 1;
  localStorage.setItem('categoryPopularity', JSON.stringify(popularityData));

  // Update user's bids
  localStorage.setItem('userBids', (currentBids - bidsRequired).toString());

  // Update task's current bids and bidders
  task.currentBids = (task.currentBids || 0) + 1;
  task.bidders = [...(task.bidders || []), userId];

  // Check if task has reached required bids (10)
  if (task.currentBids >= 10) {
    task.status = "active";
    // Randomly select 5 bidders for payment
    const shuffledBidders = task.bidders.sort(() => Math.random() - 0.5);
    task.selectedTaskers = shuffledBidders.slice(0, 5);
    
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

    // Update user earnings for selected taskers
    const userEarnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
    task.selectedTaskers.forEach(taskerId => {
      userEarnings[taskerId] = (userEarnings[taskerId] || 0) + task.taskerPayout;
    });
    localStorage.setItem('userEarnings', JSON.stringify(userEarnings));
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

  // Add to user's active tasks
  const userActiveTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
  if (!userActiveTasks.some((t: Task) => t.id === task.id)) {
    userActiveTasks.push(task);
    localStorage.setItem('userActiveTasks', JSON.stringify(userActiveTasks));
  }

  // Check for expired tasks and generate new ones
  const now = new Date();
  const expiredTasks = tasks.filter(t => new Date(t.deadline) < now);
  if (expiredTasks.length > 0) {
    const newTasks = expiredTasks.map(() => generateNewTask());
    const remainingTasks = tasks.filter(t => new Date(t.deadline) >= now);
    localStorage.setItem('tasks', JSON.stringify([...remainingTasks, ...newTasks]));

    // Add notifications for expired tasks
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    expiredTasks.forEach(expiredTask => {
      if (expiredTask.bidders?.includes(userId)) {
        notifications.unshift({
          id: Date.now().toString(),
          title: "Task Expired",
          message: `Task "${expiredTask.title}" (ID: ${expiredTask.code}) has expired`,
          type: "warning",
          date: new Date().toISOString()
        });
      }
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  return task;
};

export const generateNewTask = (category?: TaskCategory): Task => {
  const popularityData = JSON.parse(localStorage.getItem('categoryPopularity') || '{}');
  const mostPopularCategory = Object.entries(popularityData)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] as TaskCategory || 'short_essay';

  const selectedCategory = category || mostPopularCategory;
  const payout = calculatePayout(selectedCategory);
  const taskerPayout = calculateTaskerPayout(selectedCategory);
  const bidsNeeded = payout === 1000 ? 10 : 5;

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
    bidsNeeded,
    currentBids: 0,
    datePosted: new Date().toISOString(),
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    status: "pending",
    bidders: [],
    selectedTaskers: [],
    rating: 0,
    totalRatings: 0
  };
};