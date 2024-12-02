import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskerSubmissionHistory } from "../TaskerSubmissionHistory";

interface SubmissionHistoryProps {
  taskerId: string;
}

export const SubmissionHistory = ({ taskerId }: SubmissionHistoryProps) => {
  const [showHistory, setShowHistory] = useState(false);

  const { data: taskerHistory = [] } = useQuery({
    queryKey: ['tasker-submissions', taskerId],
    queryFn: async () => {
      if (!taskerId) return [];
      
      const { data, error } = await supabase
        .from('task_submissions')
        .select('*')
        .eq('bidder_id', taskerId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!taskerId
  });

  return (
    <Dialog open={showHistory} onOpenChange={setShowHistory}>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setShowHistory(true)}
      >
        View History
      </Button>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Tasker Submission History</DialogTitle>
        </DialogHeader>
        <TaskerSubmissionHistory 
          submissions={taskerHistory} 
          taskerId={taskerId} 
        />
      </DialogContent>
    </Dialog>
  );
};