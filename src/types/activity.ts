export type ActivityType = "submission" | "approval" | "rejection" | "pending";

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
}