export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  bids: number | null;
  tasks_completed: number | null;
  total_payouts: number | null;
  pending_payouts: number | null;
  join_date: string | null;
  is_suspended: boolean | null;
  created_at: string | null;
  phone: string | null;
  suspended_at: string | null;
  is_admin: boolean | null;
}