import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { startOfDay, endOfDay } from "date-fns";

const AdminFinances = () => {
  // Total Revenue from bid purchases
  const { data: totalRevenue = 0 } = useQuery({
    queryKey: ['total-revenue'],
    queryFn: async () => {
      const totalSpent = parseFloat(localStorage.getItem('totalSpent') || '0');
      return totalSpent;
    }
  });

  // Calculate potential payouts for approved tasks for the current day
  const { data: potentialPayouts = 0 } = useQuery({
    queryKey: ['potential-payouts'],
    queryFn: async () => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);

      return tasks.reduce((total: number, task: any) => {
        const approvedSubmissions = task.submissions?.filter((submission: any) => {
          const submissionDate = new Date(submission.submittedAt);
          return submission.status === 'approved' && 
                 submissionDate >= startOfToday && 
                 submissionDate <= endOfToday;
        }) || [];

        const payoutForTask = approvedSubmissions.length * task.taskerPayout;
        return total + payoutForTask;
      }, 0);
    }
  });

  // Net balance is revenue minus potential payouts
  const netBalance = totalRevenue - potentialPayouts;

  const { data: recentPayouts = [] } = useQuery({
    queryKey: ['recent-payouts'],
    queryFn: async () => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const payouts = tasks
        .flatMap((task: any) => 
          (task.submissions || [])
            .filter((s: any) => s.status === 'approved')
            .map((s: any) => ({
              id: `${task.id}-${s.bidderId}`,
              taskCode: task.code,
              amount: task.taskerPayout,
              status: 'Approved',
              date: s.submittedAt
            }))
        )
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
      
      return payouts;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1E40AF]">Financial Management</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">KES {totalRevenue}</div>
                <p className="text-sm text-gray-500">From bid purchases</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Potential Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">KES {potentialPayouts}</div>
                <p className="text-sm text-gray-500">Pending payouts for today's approved tasks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">KES {netBalance}</div>
                <p className="text-sm text-gray-500">Revenue - Today's Potential Payouts</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Code</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayouts.map((payout: any) => (
                    <TableRow key={payout.id}>
                      <TableCell>{payout.taskCode}</TableCell>
                      <TableCell>KES {payout.amount}</TableCell>
                      <TableCell>{payout.status}</TableCell>
                      <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminFinances;