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
      return "Write a concise essay on a given topic (500 words)";
    case "long_essay":
      return "Create a detailed essay exploring the subject (1000+ words)";
    case "item_listing":
      return "Create product listings with descriptions and specifications";
    case "voice_recording":
      return "Record clear voice content following the provided script";
  }
};

export const calculateBidsRequired = (payout: number) => {
  return Math.ceil(payout / 100);
};

const generateTask = (category: TaskCategory): Task => {
  const payout = Math.floor(Math.random() * (1000 - 300) + 300);
  const bidsRequired = calculateBidsRequired(payout);
  
  return {
    id: Date.now().toString(),
    title: `${category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Task`,
    description: generateTaskDescription(category),
    category,
    payout,
    workingTime: payout > 500 ? "2-3 hours" : "1-2 hours",
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

export const calculatePayout = (bidsRequired: number) => {
  return (bidsRequired * MULTIPLIER * 1.25);
};