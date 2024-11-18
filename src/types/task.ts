export type TaskStatus = "pending" | "active" | "assigned" | "completed" | "rejected";
export type TaskCategory = "short_essay" | "long_essay" | "item_listing" | "voice_recording";

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  category: TaskCategory;
  payout: number;
  taskerPayout: number;
  platformFee: number;
  workingTime: string;
  datePosted: string;
  bidsNeeded: number;
  currentBids: number;
  status: TaskStatus;
  bidders: string[];
  selectedTaskers: string[];
  submissionDate?: string;
  rejectionReason?: string;
}