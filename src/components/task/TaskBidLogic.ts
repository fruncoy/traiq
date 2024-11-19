import { Task, TaskSubmission } from "@/types/task";

export const handleTaskBid = async (
  task: Task, 
  userBids: number,
  tasks: Task[],
  userId: string = 'current-user-id'
) => {
  if (!task) throw new Error("Task not found");

  if (task.currentBids >= task.maxBidders) {
    throw new Error("Task has reached maximum bidders");
  }

  const currentBids = parseInt(localStorage.getItem('userBids') || '0');
  const bidsRequired = task.category === 'genai' ? 10 : 5;
  
  if (currentBids < bidsRequired) throw new Error("insufficient_bids");
  
  localStorage.setItem('userBids', (currentBids - bidsRequired).toString());

  task.currentBids = (task.currentBids || 0) + 1;
  task.bidders = [...(task.bidders || []), userId];
  
  const userActiveTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
  const updatedTask = { ...task, status: "active" };
  userActiveTasks.push(updatedTask);
  localStorage.setItem('userActiveTasks', JSON.stringify(userActiveTasks));

  const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  return updatedTask;
};

export const processTaskSubmission = async (task: Task, submission: TaskSubmission) => {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const updatedTasks = tasks.map((t: Task) => {
    if (t.id === task.id) {
      return {
        ...t,
        submissions: [...(t.submissions || []), submission]
      };
    }
    return t;
  });
  
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
  // Update potential payouts
  const potentialPayouts = parseFloat(localStorage.getItem('potentialPayouts') || '0');
  localStorage.setItem('potentialPayouts', (potentialPayouts + task.payout).toString());
  
  // Update user submissions
  const userSubmissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
  userSubmissions.push({
    id: submission.bidderId + Date.now(),
    taskId: task.id,
    taskTitle: task.title,
    taskCode: task.code,
    fileName: submission.fileName,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    payout: task.payout
  });
  localStorage.setItem('taskSubmissions', JSON.stringify(userSubmissions));
  
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.unshift({
    id: Date.now().toString(),
    title: "Task Submitted",
    message: `Your submission for task ${task.code} is pending review`,
    type: "info",
    date: new Date().toISOString()
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  return task;
};

export const approveSubmission = async (taskId: string, bidderId: string) => {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const task = tasks.find((t: Task) => t.id === taskId);
  
  if (!task) throw new Error("Task not found");
  
  // Update task submission status
  const updatedTasks = tasks.map((t: Task) => {
    if (t.id === taskId) {
      const updatedSubmissions = t.submissions?.map(s => {
        if (s.bidderId === bidderId) {
          return { ...s, status: 'approved' };
        }
        return s;
      });
      return { ...t, submissions: updatedSubmissions };
    }
    return t;
  });
  
  // Update user earnings
  const userEarnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
  userEarnings[bidderId] = (userEarnings[bidderId] || 0) + task.taskerPayout;
  localStorage.setItem('userEarnings', JSON.stringify(userEarnings));
  
  // Update total earnings history
  const earningsHistory = JSON.parse(localStorage.getItem('earningsHistory') || '{}');
  earningsHistory[bidderId] = (earningsHistory[bidderId] || 0) + task.taskerPayout;
  localStorage.setItem('earningsHistory', JSON.stringify(earningsHistory));
  
  // Update platform revenue
  const totalRevenue = parseFloat(localStorage.getItem('totalSpent') || '0');
  localStorage.setItem('totalSpent', (totalRevenue + task.platformFee).toString());
  
  // Update potential payouts
  const potentialPayouts = parseFloat(localStorage.getItem('potentialPayouts') || '0');
  localStorage.setItem('potentialPayouts', (potentialPayouts - task.payout).toString());
  
  // Update task submissions in localStorage
  const taskSubmissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
  const updatedTaskSubmissions = taskSubmissions.map((submission: any) => {
    if (submission.taskId === taskId) {
      return { ...submission, status: 'approved' };
    }
    return submission;
  });
  localStorage.setItem('taskSubmissions', JSON.stringify(updatedTaskSubmissions));
  
  // Save updated tasks
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
  return task;
};