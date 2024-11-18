export type TaskStatus = "pending" | "active" | "assigned" | "completed";
export type TaskCategory = "short_essay" | "long_essay" | "item_listing" | "voice_recording";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  payout: number;
  workingTime: string;
  datePosted: string;
  bidsNeeded: number;
  currentBids: number;
  status?: TaskStatus;
  bidders?: string[];
  selectedTaskers?: string[];
}