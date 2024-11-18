import { Task, TaskCategory } from "@/types/task";

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

export const calculateBidsRequired = () => {
  return 10; // All tasks require 10 bids
};

export const calculatePayout = (category: TaskCategory): number => {
  switch (category) {
    case "long_essay":
      return 1000; // 1000 KES tasks
    default:
      return 500; // 500 KES tasks
  }
};

export const calculateTaskerPayout = (category: TaskCategory): number => {
  return category === "long_essay" ? 500 : 250;
};

export const calculatePlatformFee = (payout: number, taskerPayout: number): number => {
  return payout - taskerPayout;
};

export const generateUniqueTaskCode = () => {
  const prefix = 'TSK';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const initializeDefaultTasks = () => {
  const defaultTasks = taskCategories.map(category => {
    const payout = calculatePayout(category);
    const taskerPayout = calculateTaskerPayout(category);
    
    return {
      id: Date.now().toString(),
      code: generateUniqueTaskCode(),
      title: `${category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Task`,
      description: generateTaskDescription(category),
      category,
      payout,
      taskerPayout,
      platformFee: calculatePlatformFee(payout, taskerPayout),
      workingTime: category === "long_essay" ? "2-3 hours" : "1-2 hours",
      bidsNeeded: 10, // All tasks require 10 bids
      currentBids: 0,
      datePosted: new Date().toISOString(),
      status: "pending",
      bidders: [],
      selectedTaskers: []
    };
  });
  
  localStorage.setItem('tasks', JSON.stringify(defaultTasks));
  localStorage.setItem('userBids', '5'); // Start with 5 bids
  localStorage.setItem('activeTasks', '[]');
  localStorage.setItem('taskSubmissions', '[]');
  localStorage.setItem('activities', '[]');
  localStorage.setItem('totalSpent', '0');
  localStorage.setItem('userBalance', '0');
  localStorage.setItem('notifications', '[]');
  localStorage.setItem('categoryPopularity', JSON.stringify(
    Object.fromEntries(taskCategories.map(cat => [cat, 0]))
  ));
  localStorage.setItem('userEarnings', '{}');
  localStorage.setItem('financeRecords', '[]');
};