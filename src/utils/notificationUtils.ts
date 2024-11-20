export type NotificationType = 'bid_purchase' | 'task_review' | 'ticket_submission' | 'task_submission';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date: string;
}

export const createNotification = (type: NotificationType, data: any) => {
  const notification: Notification = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    read: false,
    ...getNotificationContent(type, data)
  };

  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.unshift(notification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
  return notification;
};

const getNotificationContent = (type: NotificationType, data: any) => {
  switch (type) {
    case 'bid_purchase':
      return {
        title: 'Bid Purchase Successful',
        message: `You have successfully purchased ${data.amount} bids`,
        type
      };
    case 'task_review':
      return {
        title: 'Task Review Update',
        message: `Your task ${data.taskCode} has been ${data.status}`,
        type
      };
    case 'ticket_submission':
      return {
        title: 'Ticket Submitted',
        message: `Your ticket "${data.title}" has been submitted successfully`,
        type
      };
    case 'task_submission':
      return {
        title: 'Task Submitted',
        message: `Your task ${data.taskCode} has been submitted for review`,
        type
      };
    default:
      return {
        title: 'Notification',
        message: 'You have a new notification',
        type
      };
  }
};