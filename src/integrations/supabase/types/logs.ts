export interface SystemLog {
  id: string;
  type: string;
  message: string;
  user_type: string;
  created_at: string | null;
  user_id: string | null;
}