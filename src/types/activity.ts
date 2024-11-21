export type ActivityType = "submission" | "approval" | "rejection" | "pending" | "bid";

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
}