export interface BidTransaction {
  id: string;
  tasker_id: string | null;
  amount: number;
  transaction_date: string | null;
}