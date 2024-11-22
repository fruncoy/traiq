export type ActivityType = 'submission' | 'approval' | 'rejection' | 'pending' | 'bid' | 'ticket' | 'bid_purchase';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
}