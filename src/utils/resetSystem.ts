import { supabase } from "@/integrations/supabase/client";

export const resetSystem = async () => {
  try {
    // Only reset tasks and related tables
    await supabase.from('tasks').delete().neq('id', '');
    await supabase.from('task_bidders').delete().neq('id', '');
    await supabase.from('task_submissions').delete().neq('id', '');
    
    // Do NOT reset these tables to preserve user data:
    // - profiles (keeps user bids and earnings)
    // - bid_transactions (keeps payment history)
    
    // Clear notifications older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    await supabase
      .from('notifications')
      .delete()
      .lt('created_at', sevenDaysAgo.toISOString());
      
  } catch (error) {
    console.error('Error resetting system:', error);
    throw error;
  }
};
