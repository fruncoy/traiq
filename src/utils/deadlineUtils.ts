import { formatInTimeZone } from 'date-fns-tz';
import { isAfter, parseISO } from 'date-fns';

export const getDeadline = (bidDate: string) => {
  const bidTime = parseISO(bidDate);
  const bidHour = parseInt(formatInTimeZone(bidTime, 'Africa/Nairobi', 'HH'));
  
  if (bidHour >= 17) {
    const deadline = new Date(bidTime);
    deadline.setDate(deadline.getDate() + 1);
    deadline.setHours(16, 0, 0, 0);
    return deadline;
  } else {
    const deadline = new Date(bidTime);
    deadline.setHours(16, 0, 0, 0);
    return deadline;
  }
};

export const isSubmissionAllowed = (bidDate?: string) => {
  if (!bidDate) return false;
  const now = new Date();
  const deadline = getDeadline(bidDate);
  return !isAfter(now, deadline);
};