import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const resetSystem = async () => {
  try {
    // Reset all task-related data
    await supabase.from('tasks').delete().neq('id', '');
    await supabase.from('task_bidders').delete().neq('id', '');
    await supabase.from('task_submissions').delete().neq('id', '');
    
    // Reset profiles (but don't delete them)
    await supabase
      .from('profiles')
      .update({
        bids: 0,
        tasks_completed: 0,
        total_payouts: 0,
        pending_payouts: 0,
        is_suspended: false,
        suspended_at: null
      });
    
    // Clear notifications
    await supabase.from('notifications').delete().neq('id', '');
    
    // Clear bid transactions
    await supabase.from('bid_transactions').delete().neq('id', '');
    
    toast.success("System has been reset successfully");
  } catch (error) {
    console.error('Error resetting system:', error);
    toast.error("Failed to reset system");
    throw error;
  }
};