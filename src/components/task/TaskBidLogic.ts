export const handleTaskBid = async (task: any, userBids: number, tasks: any[]) => {
  const requiredBids = task.category === 'genai' ? 10 : 5; // Genai tasks need 10 bids, Creai need 5
  
  if (userBids < requiredBids) {
    throw new Error("insufficient_bids");
  }

  // Check if user has already bid on this task
  if (task.bidders?.includes(task.currentTasker?.id)) {
    throw new Error("already_bid");
  }

  // Update task bidders and current bids count
  const updatedTask = {
    ...task,
    bidders: [...(task.bidders || []), task.currentTasker?.id],
    currentBids: (task.currentBids || 0) + 1
  };

  // Update tasks in localStorage
  const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  // Update user bids
  const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
  const updatedTaskers = taskers.map((t: any) => {
    if (t.id === task.currentTasker?.id) {
      return {
        ...t,
        bids: t.bids - requiredBids,
        activeTasks: [...(t.activeTasks || []), task.id]
      };
    }
    return t;
  });
  localStorage.setItem('taskers', JSON.stringify(updatedTaskers));

  // Store task in user's active tasks
  const userActiveTasks = JSON.parse(localStorage.getItem(`userActiveTasks_${task.currentTasker?.id}`) || '[]');
  userActiveTasks.push(updatedTask);
  localStorage.setItem(`userActiveTasks_${task.currentTasker?.id}`, JSON.stringify(userActiveTasks));

  // Create notification
  const notifications = JSON.parse(localStorage.getItem(`notifications_${task.currentTasker?.id}`) || '[]');
  notifications.unshift({
    id: Date.now().toString(),
    title: 'Task Bid Successful',
    message: `You have successfully bid on task ${task.code}`,
    type: 'success',
    read: false,
    date: new Date().toISOString(),
    taskerId: task.currentTasker?.id
  });
  localStorage.setItem(`notifications_${task.currentTasker?.id}`, JSON.stringify(notifications));

  return updatedTask;
};