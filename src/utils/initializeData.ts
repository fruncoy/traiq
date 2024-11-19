import { Task, TaskCategory } from "@/types/task";

const taskCategories: TaskCategory[] = [
  "short_essay",
  "long_essay",
  "item_listing",
  "voice_recording"
];

const generateTaskDescription = (category: TaskCategory) => {
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

const generateUniqueTaskCode = () => {
  const prefix = 'TSK';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const initializeDefaultTasks = () => {
  const deadline = new Date();
  deadline.setHours(16, 0, 0, 0); // Set deadline to 4 PM today

  // Generate exactly 10 unique tasks
  const defaultTasks = Array(10).fill(null).map((_, index) => {
    const category = taskCategories[index % taskCategories.length];
    const payout = Math.floor(Math.random() * (1000 - 500 + 1)) + 500; // Random payout between 500-1000
    const taskerPayout = Math.floor(payout * 0.5); // 50% of payout goes to tasker
    
    return {
      id: Date.now().toString() + index,
      code: generateUniqueTaskCode(),
      title: `${category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Task ${index + 1}`,
      description: generateTaskDescription(category),
      category,
      payout,
      taskerPayout,
      platformFee: payout - taskerPayout,
      workingTime: "24 hours",
      bidsNeeded: 1,
      currentBids: 0,
      datePosted: new Date().toISOString(),
      deadline: deadline.toISOString(),
      status: "pending",
      bidders: [],
      selectedTaskers: [],
      submissions: [],
      rating: 0,
      totalRatings: 0
    };
  });
  
  localStorage.setItem('tasks', JSON.stringify(defaultTasks));
  localStorage.setItem('userBids', '5');
  localStorage.setItem('userActiveTasks', '[]');
  localStorage.setItem('taskSubmissions', '[]');
  localStorage.setItem('notifications', '[]');
  localStorage.setItem('activities', '[]');
  localStorage.setItem('categoryPopularity', JSON.stringify(
    Object.fromEntries(taskCategories.map(cat => [cat, 0]))
  ));
  localStorage.setItem('totalSpent', '0');
  localStorage.setItem('userBalance', '0');
  localStorage.setItem('userEarnings', '{}');
  localStorage.setItem('financeRecords', '[]');
};