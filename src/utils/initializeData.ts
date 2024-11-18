export const initializeDefaultTasks = () => {
  const defaultTasks = [
    {
      id: "1",
      title: "Content Writing Task 1",
      description: "Write engaging content for our platform",
      payout: 300,
      workingTime: "1-2 hours",
      bidsNeeded: 10,
      currentBids: 0,
      datePosted: new Date().toISOString().split('T')[0]
    },
    {
      id: "2",
      title: "Content Writing Task 2",
      description: "Create compelling blog posts",
      payout: 400,
      workingTime: "2-3 hours",
      bidsNeeded: 10,
      currentBids: 0,
      datePosted: new Date().toISOString().split('T')[0]
    },
    {
      id: "3",
      title: "Content Writing Task 3",
      description: "Develop article content",
      payout: 350,
      workingTime: "1-2 hours",
      bidsNeeded: 10,
      currentBids: 0,
      datePosted: new Date().toISOString().split('T')[0]
    }
  ];

  localStorage.setItem('tasks', JSON.stringify(defaultTasks));
  localStorage.setItem('userBids', '0');
  localStorage.setItem('activeTasks', '[]');
  localStorage.setItem('taskSubmissions', '[]');
  localStorage.setItem('activities', '[]');
  localStorage.setItem('totalSpent', '0');
  localStorage.setItem('userBalance', '0');
};