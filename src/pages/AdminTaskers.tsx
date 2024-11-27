import Sidebar from "../components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";
import { TaskerSuspendButton } from "@/components/admin/TaskerSuspendButton";
import { format } from "date-fns";

const AdminTaskers = () => {
  const { data: taskers = [], isLoading } = useQuery({
    queryKey: ['admin-taskers'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          task_submissions(
            status,
            task_id
          ),
          task_bidders(
            task_id
          )
        `);

      if (error) throw error;

      return profiles.map((profile: any) => {
        const completedTasks = profile.task_submissions?.filter(
          (s: any) => s.status === 'approved'
        ).length || 0;

        const activeBids = profile.task_bidders?.length || 0;

        return {
          ...profile,
          completedTasks,
          activeBids
        };
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#1E40AF] mb-6">Taskers Management</h2>
          <Card>
            <CardContent className="p-0">
              {taskers.length === 0 ? (
                <p className="text-center text-gray-500 p-4">No taskers found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Completed Tasks</TableHead>
                      <TableHead>Active Bids</TableHead>
                      <TableHead>Available Bids</TableHead>
                      <TableHead>Total Payouts</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskers.map((tasker: any) => (
                      <TableRow key={tasker.id}>
                        <TableCell>{tasker.username || 'N/A'}</TableCell>
                        <TableCell>{tasker.email || 'N/A'}</TableCell>
                        <TableCell>{tasker.completedTasks}</TableCell>
                        <TableCell>{tasker.activeBids}</TableCell>
                        <TableCell>{tasker.bids || 0}</TableCell>
                        <TableCell>KES {tasker.total_payouts || 0}</TableCell>
                        <TableCell>
                          {tasker.join_date ? format(new Date(tasker.join_date), 'MMM d, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tasker.suspended_at 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {tasker.suspended_at ? 'Suspended' : 'Active'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <TaskerSuspendButton 
                            taskerId={tasker.id} 
                            isSuspended={!!tasker.suspended_at}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminTaskers;