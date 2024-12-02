export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bid_transactions: {
        Row: {
          amount: number
          id: string
          tasker_id: string | null
          transaction_date: string | null
        }
        Insert: {
          amount: number
          id?: string
          tasker_id?: string | null
          transaction_date?: string | null
        }
        Update: {
          amount?: number
          id?: string
          tasker_id?: string | null
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_transactions_tasker_id_fkey"
            columns: ["tasker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bids: number | null
          created_at: string | null
          email: string | null
          id: string
          is_suspended: boolean | null
          join_date: string | null
          pending_payouts: number | null
          phone: string | null
          suspended_at: string | null
          tasks_completed: number | null
          total_payouts: number | null
          username: string | null
        }
        Insert: {
          bids?: number | null
          created_at?: string | null
          email?: string | null
          id: string
          is_suspended?: boolean | null
          join_date?: string | null
          pending_payouts?: number | null
          phone?: string | null
          suspended_at?: string | null
          tasks_completed?: number | null
          total_payouts?: number | null
          username?: string | null
        }
        Update: {
          bids?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_suspended?: boolean | null
          join_date?: string | null
          pending_payouts?: number | null
          phone?: string | null
          suspended_at?: string | null
          tasks_completed?: number | null
          total_payouts?: number | null
          username?: string | null
        }
        Relationships: []
      }
      task_bidders: {
        Row: {
          bid_date: string | null
          bidder_id: string | null
          id: string
          task_id: string | null
        }
        Insert: {
          bid_date?: string | null
          bidder_id?: string | null
          id?: string
          task_id?: string | null
        }
        Update: {
          bid_date?: string | null
          bidder_id?: string | null
          id?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_bidders_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_bidders_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_submissions: {
        Row: {
          bidder_id: string | null
          file_name: string | null
          file_url: string | null
          id: string
          rejection_reason: string | null
          status: string | null
          submitted_at: string | null
          task_id: string | null
        }
        Insert: {
          bidder_id?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          rejection_reason?: string | null
          status?: string | null
          submitted_at?: string | null
          task_id?: string | null
        }
        Update: {
          bidder_id?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          rejection_reason?: string | null
          status?: string | null
          submitted_at?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_submissions_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          bids_needed: number | null
          category: string | null
          code: string | null
          created_at: string | null
          current_bids: number | null
          date_posted: string | null
          deadline: string | null
          description: string | null
          id: string
          max_bidders: number | null
          payout: number | null
          platform_fee: number | null
          status: string | null
          tasker_payout: number | null
          title: string
        }
        Insert: {
          bids_needed?: number | null
          category?: string | null
          code?: string | null
          created_at?: string | null
          current_bids?: number | null
          date_posted?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          max_bidders?: number | null
          payout?: number | null
          platform_fee?: number | null
          status?: string | null
          tasker_payout?: number | null
          title: string
        }
        Update: {
          bids_needed?: number | null
          category?: string | null
          code?: string | null
          created_at?: string | null
          current_bids?: number | null
          date_posted?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          max_bidders?: number | null
          payout?: number | null
          platform_fee?: number | null
          status?: string | null
          tasker_payout?: number | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_submission_deadline: {
        Args: {
          bid_time: string
        }
        Returns: string
      }
      expire_tasks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      manual_system_reset: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      notify_pending_submissions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
