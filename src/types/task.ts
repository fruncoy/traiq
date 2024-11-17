export type TaskStatus = "active" | "assigned" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  payout: number;
  deadline: string;
  status: TaskStatus;
}