import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { startOfWeek, endOfWeek, format } from "date-fns";

const AdminFinances = () => {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  // Total Revenue from bid purchases for current week
  const { data: totalRevenue = 0 } = useQuery({
    queryKey: ['total-revenue'],
    queryFn: async () => {
      const totalSpent = parseFloat(localStorage.getItem('totalSpent') || '0');
      return totalSpent;
    }
  });

  // Calculate approved payouts for the current week
  const { data: approvedPayouts = 0 } = useQuery({
    queryKey: ['approved-payouts'],
    queryFn: async () => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      return tasks.reduce((total: number, task: any) => {
        const approvedSubmissions = task.submissions?.filter((submission: any) => {
          const submissionDate = new Date(submission.submittedAt);
          return submission.status === 'approved' && 
                 submissionDate >= weekStart && 
                 submissionDate <= weekEnd;
        }) || [];

        const payoutForTask = approvedSubmissions.length * (task.category === 'genai' ? 400 : 200);
        return total + payoutForTask;
      }, 0);
    }
  });

  // Calculate profit (Total Revenue - Approved Payouts)
  const profit = totalRevenue - approvedPayouts;

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
              amount: task.category === 'genai' ? 400 : 200,
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
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1E40AF]">Financial Management</h2>
            <div className="text-sm text-gray-600">
              Week: {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">KES {totalRevenue}</div>
                <p className="text-sm text-gray-500">From bid purchases this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approved Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">KES {approvedPayouts}</div>
                <p className="text-sm text-gray-500">Total approved task payouts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${profit < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  KES {profit}
                </div>
                <p className="text-sm text-gray-500">Revenue - Approved Payouts</p>
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
                      <TableCell>{format(new Date(payout.date), 'MMM d, yyyy')}</TableCell>
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