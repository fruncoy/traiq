export const handleTaskBid = async (task: any, userBids: number, tasks: any[]) => {
  if (userBids < (task.category === 'genai' ? 10 : 5)) {
    throw new Error("insufficient_bids");
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
        bids: t.bids - (task.category === 'genai' ? 10 : 5)
      };
    }
    return t;
  });
  localStorage.setItem('taskers', JSON.stringify(updatedTaskers));

  return updatedTask;
};