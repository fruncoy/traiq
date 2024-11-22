export const handleBidSubmission = (task: any, userBids: number) => {
  const requiredBids = task.category === 'genai' ? 10 : 5;
  const currentTasker = JSON.parse(sessionStorage.getItem('currentTasker') || '{}');
  
  if (!currentTasker.id) {
    throw new Error("No tasker logged in");
  }

  // Validate bid requirements
  if (userBids < requiredBids) {
    throw new Error("insufficient_bids");
  }

  if (task.currentBids >= task.maxBidders) {
    throw new Error("max_bidders_reached");
  }

  // Check if user has already bid on this task
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const existingTask = tasks.find((t: any) => t.id === task.id);
  
  if (existingTask.bidders.includes(currentTasker.id)) {
    throw new Error("already_bid");
  }

  // Update task with new bidder
  const updatedTask = {
    ...task,
    bidders: [...task.bidders, currentTasker.id],
    currentBids: task.currentBids + 1
  };

  // Update tasks in localStorage
  const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  // Update user bids - make sure we're updating the correct tasker
  const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
  const updatedTaskers = taskers.map((t: any) => {
    if (t.id === currentTasker.id) {
      return {
        ...t,
        bids: Math.max(0, t.bids - requiredBids)
      };
    }
    return t;
  });
  localStorage.setItem('taskers', JSON.stringify(updatedTaskers));

  // Update current tasker's bids in sessionStorage
  const updatedCurrentTasker = {
    ...currentTasker,
    bids: Math.max(0, currentTasker.bids - requiredBids)
  };
  sessionStorage.setItem('currentTasker', JSON.stringify(updatedCurrentTasker));

  // Store task in user's active tasks with the correct tasker ID
  const userActiveTasks = JSON.parse(localStorage.getItem(`userActiveTasks_${currentTasker.id}`) || '[]');
  if (!userActiveTasks.some((t: any) => t.id === task.id)) {
    userActiveTasks.push(updatedTask);
    localStorage.setItem(`userActiveTasks_${currentTasker.id}`, JSON.stringify(userActiveTasks));
  }

  // Create notification with the correct tasker ID
  const notifications = JSON.parse(localStorage.getItem(`notifications_${currentTasker.id}`) || '[]');
  notifications.unshift({
    id: Date.now().toString(),
    type: 'bid_placed',
    message: `You have successfully bid on task ${task.code}`,
    timestamp: new Date().toISOString(),
    read: false
  });
  localStorage.setItem(`notifications_${currentTasker.id}`, JSON.stringify(notifications));

  return updatedTask;
};