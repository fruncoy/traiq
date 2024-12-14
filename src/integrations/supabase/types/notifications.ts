export interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: string;
  created_at: string | null;
  read: boolean | null;
}