export const handleTaskBid = async (task: any, userBids: number, tasks: any[]) => {
  const requiredBids = task.category === 'genai' ? 10 : 5;
  const MAX_BIDDERS = 10; // All tasks now have 10 max bidders
  const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');
  
  if (!currentTasker.id) {
    throw new Error("No tasker logged in");
  }

  // Validate bid requirements
  if (userBids < requiredBids) {
    throw new Error("insufficient_bids");
  }

  // Check if user has already bid on this task
  const existingBids = tasks.find(t => t.id === task.id)?.bidders || [];
  if (existingBids.includes(currentTasker.id)) {
    throw new Error("You have already bid on this task");
  }

  // Check if task has reached maximum bidders
  if (existingBids.length >= MAX_BIDDERS) {
    throw new Error("This task has reached its maximum number of bidders");
  }

  // Check if user has a rejected submission for this task
  const hasRejectedSubmission = task.submissions?.some((s: any) => 
    s.bidderId === currentTasker.id && s.status === 'rejected'
  );
  if (hasRejectedSubmission) {
    throw new Error("You cannot bid on this task as your previous submission was rejected");
  }

  // Update task bidders and current bids count
  const updatedTask = {
    ...task,
    bidders: [...(task.bidders || []), currentTasker.id],
    currentBids: (task.currentBids || 0) + 1
  };

  // Update tasks in localStorage
  const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  // Update user bids
  const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
  const updatedTaskers = taskers.map((t: any) => {
    if (t.id === currentTasker.id) {
      return {
        ...t,
        bids: Math.max(0, t.bids - requiredBids),
        activeTasks: [...(t.activeTasks || []), task.id]
      };
    }
    return t;
  });
  localStorage.setItem('taskers', JSON.stringify(updatedTaskers));

  // Update current tasker's bids
  const updatedCurrentTasker = {
    ...currentTasker,
    bids: Math.max(0, currentTasker.bids - requiredBids)
  };
  localStorage.setItem('currentTasker', JSON.stringify(updatedCurrentTasker));

  // Store task in user's active tasks
  const userActiveTasks = JSON.parse(localStorage.getItem(`userActiveTasks_${currentTasker.id}`) || '[]');
  if (!userActiveTasks.some((t: any) => t.id === task.id)) {
    userActiveTasks.push(updatedTask);
    localStorage.setItem(`userActiveTasks_${currentTasker.id}`, JSON.stringify(userActiveTasks));
  }

  // Create notification
  const notifications = JSON.parse(localStorage.getItem(`notifications_${currentTasker.id}`) || '[]');
  notifications.unshift({
    id: Date.now().toString(),
    title: 'Task Bid Successful',
    message: `You have successfully bid on task ${task.code} - ${task.title}`,
    type: 'success',
    read: false,
    date: new Date().toISOString(),
    taskerId: currentTasker.id
  });
  localStorage.setItem(`notifications_${currentTasker.id}`, JSON.stringify(notifications));

  return updatedTask;
};