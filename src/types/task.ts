export type TaskStatus = "pending" | "active" | "assigned" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  payout: number;
  workingTime: string;
  datePosted: string;
  bidsNeeded: number;
  currentBids: number;
  status?: TaskStatus;
}