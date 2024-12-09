import { supabase } from "@/integrations/supabase/client";
import { formatInTimeZone } from 'date-fns-tz';

const checkBiddingAllowed = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 4 is Thursday, 5 is Friday
  const eatTime = formatInTimeZone(now, 'Africa/Nairobi', 'HH');
  const hour = parseInt(eatTime);

  if ((dayOfWeek === 4 && hour >= 16) || (dayOfWeek === 5 && hour < 8)) {
    throw new Error("Bidding is not allowed between Thursday 4 PM and Friday 8 AM.");
  }
};

export const handleTaskBid = async (task: any, userBids: number) => {
  checkBiddingAllowed();

  const requiredBids = task.category === 'genai' ? 10 : 5;
  const MAX_BIDDERS = 10;

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("No tasker logged in");
  }

  // Validate bid requirements
  if (userBids < requiredBids) {
    throw new Error("insufficient_bids");
  }

  // Check if user has already bid on this task
  const { data: existingBids } = await supabase
    .from('task_bidders')
    .select('*')
    .eq('task_id', task.id)
    .eq('bidder_id', user.id);

  if (existingBids && existingBids.length > 0) {
    throw new Error("You have already bid on this task");
  }

  // Check if task has reached maximum bidders
  const { data: totalBidders } = await supabase
    .from('task_bidders')
    .select('*', { count: 'exact' })
    .eq('task_id', task.id);

  if (totalBidders && totalBidders.length >= MAX_BIDDERS) {
    throw new Error("This task has reached its maximum number of bidders");
  }

  // Check if user has a rejected submission
  const { data: submissions } = await supabase
    .from('task_submissions')
    .select('*')
    .eq('task_id', task.id)
    .eq('bidder_id', user.id)
    .eq('status', 'rejected');

  if (submissions && submissions.length > 0) {
    throw new Error("You cannot bid on this task as your previous submission was rejected");
  }

  // Start a transaction to update everything
  const { error: bidError } = await supabase
    .from('task_bidders')
    .insert({
      task_id: task.id,
      bidder_id: user.id
    });

  if (bidError) throw bidError;

  // Update task current bids
  const { error: taskError } = await supabase
    .from('tasks')
    .update({ current_bids: (task.current_bids || 0) + 1 })
    .eq('id', task.id);

  if (taskError) throw taskError;

  // Update user bids
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      bids: Math.max(0, userBids - requiredBids)
    })
    .eq('id', user.id);

  if (profileError) throw profileError;

  // Create notification for successful bid
  const { error: notificationError } = await supabase
    .from('notifications')
    .insert({
      user_id: user.id,
      title: 'Bid Placed Successfully',
      message: `You have successfully bid on task ${task.code} (${task.title})`,
      type: 'bid'
    });

  if (notificationError) throw notificationError;

  // Return updated task
  const { data: updatedTask } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', task.id)
    .single();

  return updatedTask;
};