export interface Task {
  id: string;
  code: string | null;
  title: string;
  description: string | null;
  category: string | null;
  payout: number | null;
  tasker_payout: number | null;
  platform_fee: number | null;
  date_posted: string | null;
  deadline: string | null;
  bids_needed: number | null;
  current_bids: number | null;
  max_bidders: number | null;
  status: string | null;
  created_at: string | null;
}

export interface TaskBidder {
  id: string;
  task_id: string | null;
  bidder_id: string | null;
  bid_date: string | null;
}

export interface TaskSubmission {
  id: string;
  task_id: string | null;
  bidder_id: string | null;
  status: string | null;
  rejection_reason: string | null;
  submitted_at: string | null;
  file_name: string | null;
  file_url: string | null;
}