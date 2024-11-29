export type TaskStatus = "pending" | "active" | "assigned" | "completed" | "rejected" | "expired";
export type TaskCategory = "genai" | "creai";

export interface TaskSubmission {
  id: string;
  task_id: string;
  bidder_id: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  submitted_at: string;
  file_name: string;
  file_url?: string;
  payout?: number;
}

export interface TaskBidder {
  bidder_id: string;
  bid_date?: string;
}

export interface Task {
  id: string;
  code: string | null;
  title: string;
  description: string | null;
  category: TaskCategory | null;
  payout: number | null;
  tasker_payout: number | null;
  platform_fee: number | null;
  date_posted: string | null;
  deadline: string | null;
  bids_needed: number | null;
  current_bids: number | null;
  max_bidders: number | null;
  status: TaskStatus | null;
  created_at: string | null;
  task_bidders?: TaskBidder[];
  task_submissions?: TaskSubmission[];
  // Computed properties for backward compatibility
  bidders?: string[];
  submissions?: TaskSubmission[];
}