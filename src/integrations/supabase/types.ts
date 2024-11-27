// Base types
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Database schema types
type DatabaseSchema = {
  Tables: {
    profiles: ProfilesTable
    tasks: TasksTable
    task_bidders: TaskBiddersTable
    task_submissions: TaskSubmissionsTable
    bid_transactions: BidTransactionsTable
  }
}

// Individual table types
type ProfilesTable = {
  Row: {
    id: string
    username: string | null
    email: string | null
    bids: number | null
    tasks_completed: number | null
    total_payouts: number | null
    pending_payouts: number | null
    join_date: string | null
    is_suspended: boolean | null
    created_at: string | null
    phone: string | null
    suspended_at: string | null
  }
  Insert: Partial<ProfilesTable['Row']>
  Update: Partial<ProfilesTable['Row']>
}

type TasksTable = {
  Row: {
    id: string
    code: string | null
    title: string
    description: string | null
    category: string | null
    payout: number | null
    tasker_payout: number | null
    platform_fee: number | null
    date_posted: string | null
    deadline: string | null
    bids_needed: number | null
    current_bids: number | null
    max_bidders: number | null
    status: string | null
    created_at: string | null
  }
  Insert: Partial<TasksTable['Row']>
  Update: Partial<TasksTable['Row']>
}

type TaskBiddersTable = {
  Row: {
    id: string
    task_id: string | null
    bidder_id: string | null
    bid_date: string | null
  }
  Insert: Partial<TaskBiddersTable['Row']>
  Update: Partial<TaskBiddersTable['Row']>
}

type TaskSubmissionsTable = {
  Row: {
    id: string
    task_id: string | null
    bidder_id: string | null
    status: string | null
    rejection_reason: string | null
    submitted_at: string | null
    file_name: string | null
    file_url: string | null
  }
  Insert: Partial<TaskSubmissionsTable['Row']>
  Update: Partial<TaskSubmissionsTable['Row']>
}

type BidTransactionsTable = {
  Row: {
    id: string
    tasker_id: string | null
    amount: number
    transaction_date: string | null
  }
  Insert: Partial<BidTransactionsTable['Row']>
  Update: Partial<BidTransactionsTable['Row']>
}

export type Database = {
  public: DatabaseSchema
}

export type { Json }