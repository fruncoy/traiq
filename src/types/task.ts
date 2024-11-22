export type TaskStatus = "pending" | "active" | "assigned" | "completed" | "rejected";
export type TaskCategory = "genai" | "creai";

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskCode: string;
  taskTitle: string;
  bidderId: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  fileName: string;
  rating?: number;
}

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  category: TaskCategory;
  payout: number;
  taskerPayout: number;
  platformFee: number;
  datePosted: string;
  deadline: string;
  bidsNeeded: number;
  currentBids: number;
  maxBidders: number;
  status: TaskStatus;
  bidders: string[];
  selectedTaskers: string[];
  submissionDate?: string;
  rejectionReason?: string;
  rating: number;
  totalRatings: number;
  submissions?: TaskSubmission[];
}