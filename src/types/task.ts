export type TaskStatus = "pending" | "active" | "inactive" | "expired";
export type TaskCategory = "genai" | "creai";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface TaskSubmission {
  id: string;
  task_id: string;
  bidder_id: string;
  status: SubmissionStatus;
  rejection_reason?: string;
  submitted_at: string;
  file_name: string;
  file_url?: string;
  payout?: number;
  profiles?: {
    username: string;
    email: string;
  };
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
  bidders: TaskBidder[];
  submissions: TaskSubmission[];
  task_bidders?: TaskBidder[];
  task_submissions?: TaskSubmission[];
}