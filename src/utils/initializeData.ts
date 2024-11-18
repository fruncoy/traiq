import { Task, TaskCategory } from "@/types/task";

const MULTIPLIER = 40;

const taskCategories: TaskCategory[] = [
  "short_essay",
  "long_essay",
  "item_listing",
  "voice_recording"
];

export const generateTaskDescription = (category: TaskCategory) => {
  switch (category) {
    case "short_essay":
      return "Write a concise essay on a given topic (250-500 words)";
    case "long_essay":
      return "Create a detailed essay exploring the subject (600+ words)";
    case "item_listing":
      return "Create detailed product listings with descriptions and specifications";
    case "voice_recording":
      return "Record clear voice content following the provided script (1-3 minutes)";
  }
};

export const calculateBidsRequired = (category: TaskCategory): number => {
  switch (category) {
    case "short_essay":
      return 5;
    case "long_essay":
      return 10;
    case "item_listing":
    case "voice_recording":
      return 5;
    default:
      return 5;
  }
};

export const calculatePayout = (category: TaskCategory): number => {
  switch (category) {
    case "short_essay":
      return 500;
    case "long_essay":
      return 1000;
    case "item_listing":
    case "voice_recording":
      return 500;
    default:
      return 500;
  }
};

const generateTask = (category: TaskCategory): Task => {
  const payout = calculatePayout(category);
  const bidsRequired = calculateBidsRequired(category);
  
  return {
    id: Date.now().toString(),
    title: `${category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Task`,
    description: generateTaskDescription(category),
    category,
    payout,
    workingTime: category === "long_essay" ? "2-3 hours" : "1-2 hours",
    bidsNeeded: 10, // System-wide bid requirement
    currentBids: 0,
    datePosted: new Date().toISOString().split('T')[0],
    bidders: [],
    selectedTaskers: []
  };
};

export const initializeDefaultTasks = () => {
  const defaultTasks = taskCategories.slice(0, 3).map(category => generateTask(category));
  
  localStorage.setItem('tasks', JSON.stringify(defaultTasks));
  localStorage.setItem('userBids', '0');
  localStorage.setItem('activeTasks', '[]');
  localStorage.setItem('taskSubmissions', '[]');
  localStorage.setItem('activities', '[]');
  localStorage.setItem('totalSpent', '0');
  localStorage.setItem('userBalance', '0');
  localStorage.setItem('categoryPopularity', JSON.stringify(
    Object.fromEntries(taskCategories.map(cat => [cat, 0]))
  ));
};