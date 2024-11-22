import { Task, TaskSubmission } from "@/types/task";

export const handleTaskBid = async (task: Task, userBids: number, tasks: Task[]) => {
  const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');
  const requiredBids = task.category === 'genai' ? 10 : 5;

  if (userBids < requiredBids) {
    throw new Error("insufficient_bids");
  }

  // Update tasker's bids
  const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
  const updatedTaskers = taskers.map((t: any) => {
    if (t.id === currentTasker.id) {
      return { ...t, bids: t.bids - requiredBids };
    }
    return t;
  });
  localStorage.setItem('taskers', JSON.stringify(updatedTaskers));

  // Update task bidders
  const updatedTask = {
    ...task,
    currentBids: (task.currentBids || 0) + 1,
    bidders: [...(task.bidders || []), currentTasker.id]
  };

  // Update tasks in localStorage
  const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  // Add to user's active tasks
  const userActiveTasks = JSON.parse(localStorage.getItem(`userActiveTasks_${currentTasker.id}`) || '[]');
  localStorage.setItem(`userActiveTasks_${currentTasker.id}`, JSON.stringify([...userActiveTasks, updatedTask]));

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

  // Store submission separately for quick access
  const submissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
  submissions.push({
    ...submission,
    taskId: task.id,
    taskCode: task.code,
    taskTitle: task.title
  });
  localStorage.setItem('taskSubmissions', JSON.stringify(submissions));

  // Add notification for admin
  const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
  adminNotifications.unshift({
    id: Date.now().toString(),
    title: 'New Task Submission',
    message: `New submission for task ${task.code}`,
    type: 'info',
    read: false,
    date: new Date().toISOString()
  });
  localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));

  return submission;
};