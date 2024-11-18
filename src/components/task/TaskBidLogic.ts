import { Task, TaskCategory } from "@/types/task";
import { toast } from "sonner";
import { 
  calculateBidsRequired, 
  calculatePayout,
  calculateTaskerPayout 
} from "@/utils/initializeData";

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
  task.currentBids += 1;
  task.bidders = [...(task.bidders || []), userId];

  // Immediately assign task to bidder
  const userTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
  userTasks.push(task);
  localStorage.setItem('userActiveTasks', JSON.stringify(userTasks));

  const updatedTasks = tasks.map(t => t.id === task.id ? task : t);

  // Check if threshold reached (10 bidders)
  if (task.currentBids >= task.bidsNeeded) {
    task.status = "active";
    // Randomly select 5 taskers from all bidders
    task.selectedTaskers = task.bidders
      ?.sort(() => Math.random() - 0.5)
      .slice(0, 5);

    const activeTasks = JSON.parse(localStorage.getItem('activeTasks') || '[]');
    activeTasks.push(task);
    localStorage.setItem('activeTasks', JSON.stringify(activeTasks));

    // Generate a new task to replace the activated one
    const newTask = generateNewTask();
    updatedTasks.push(newTask);

    const remainingTasks = updatedTasks.filter(t => t.id !== task.id);
    localStorage.setItem('tasks', JSON.stringify(remainingTasks));

    // Log activity
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    activities.unshift({
      id: Date.now().toString(),
      type: "approval",
      message: `Task "${task.title}" is now active`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('activities', JSON.stringify(activities));
  } else {
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  }

  return task;
};

export const generateNewTask = (category?: TaskCategory): Task => {
  const popularityData = JSON.parse(localStorage.getItem('categoryPopularity') || '{}');
  const mostPopularCategory = Object.entries(popularityData)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0][0] as TaskCategory;

  const selectedCategory = category || mostPopularCategory;
  const payout = calculatePayout(selectedCategory);
  const bidsRequired = calculateBidsRequired(selectedCategory);

  return {
    id: Date.now().toString(),
    title: `${selectedCategory.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Task`,
    description: generateTaskDescription(selectedCategory),
    category: selectedCategory,
    payout,
    workingTime: selectedCategory === "long_essay" ? "2-3 hours" : "1-2 hours",
    bidsNeeded: 10,
    currentBids: 0,
    bidders: [],
    selectedTaskers: []
  };
};