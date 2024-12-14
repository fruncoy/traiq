// Split into multiple files for better organization
export * from './types/auth';
export * from './types/profiles';
export * from './types/tasks';
export * from './types/logs';
export * from './types/notifications';
export * from './types/transactions';

// Base types shared across files
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bid_transactions: Tables<"bid_transactions">;
      notifications: Tables<"notifications">;
      profiles: Tables<"profiles">;
      system_logs: Tables<"system_logs">;
      task_bidders: Tables<"task_bidders">;
      task_submissions: Tables<"task_submissions">;
      tasks: Tables<"tasks">;
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      check_submission_deadline: {
        Args: { bid_time: string };
        Returns: string;
      };
      expire_tasks: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      manual_system_reset: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      notify_pending_submissions: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      update_tasker_stats: {
        Args: {
          p_tasker_id: string;
          p_task_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
}