import { supabase } from "@/integrations/supabase/client";

export const resetSystem = async () => {
  try {
    // Reset all tables
    await supabase.from('tasks').delete().neq('id', '');
    await supabase.from('task_bidders').delete().neq('id', '');
    await supabase.from('task_submissions').delete().neq('id', '');
    await supabase.from('bid_transactions').delete().neq('id', '');
    
    // Reset profiles to default values
    await supabase.from('profiles').update({
      bids: 0,
      tasks_completed: 0,
      total_payouts: 0,
      pending_payouts: 0,
      is_suspended: false,
      suspended_at: null
    }).neq('id', '');
    
    // Clear local storage
    localStorage.clear();
  } catch (error) {
    console.error('Error resetting system:', error);
    throw error;
  }
};