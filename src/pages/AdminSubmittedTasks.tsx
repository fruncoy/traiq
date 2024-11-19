import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task } from "@/types/task";

const AdminSubmittedTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const handleApprove = async (taskId: string, bidderId: string) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = tasks.map((task: Task) => {
      if (task.id === taskId) {
        const submission = task.submissions?.find(s => s.bidderId === bidderId);
        if (submission) {
          submission.status = 'approved';
          
          // Update tasker's earnings
          const userEarnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
          userEarnings[bidderId] = (userEarnings[bidderId] || 0) + task.taskerPayout;
          localStorage.setItem('userEarnings', JSON.stringify(userEarnings));
        }
      }
      return task;
    });
    
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    toast.success("Submission approved");
  };

  const handleReject = async (taskId: string, bidderId: string, reason: string) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = tasks.map((task: Task) => {
      if (task.id === taskId) {
        const submission = task.submissions?.find(s => s.bidderId === bidderId);
        if (submission) {
          submission.status = 'rejected';
          submission.rejectionReason = reason;
        }
      }
      return task;
    });
    
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    toast.error("Submission rejected");
  };

  const tasksWithBidders = tasks.filter(task => task.bidders?.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">Task Submissions</h2>
          
          {tasksWithBidders.map((task: Task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">
                  {task.title} - {task.code}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Bidders: {task.bidders?.length || 0}
                  </div>
                  
                  {task.bidders?.map((bidderId: string) => {
                    const submission = task.submissions?.find(s => s.bidderId === bidderId);
                    
                    return (
                      <div key={bidderId} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Tasker ID: {bidderId}</h4>
                            {submission ? (
                              <>
                                <p className="text-sm text-gray-600">
                                  Status: {submission.status}
                                </p>
                                {submission.rejectionReason && (
                                  <p className="text-sm text-red-600">
                                    Reason: {submission.rejectionReason}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-sm text-yellow-600">
                                Pending Submission
                              </p>
                            )}
                          </div>
                          
                          {submission && submission.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApprove(task.id, bidderId)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleReject(task.id, bidderId, "Poor quality")}
                                variant="destructive"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {tasksWithBidders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tasks have been bid on yet
            </div>
          )}
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminSubmittedTasks;