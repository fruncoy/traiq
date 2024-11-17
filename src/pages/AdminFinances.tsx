import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

const AdminFinances = () => {
  const { data: totalBalance = 0 } = useQuery({
    queryKey: ['total-spent'],
    queryFn: async () => {
      return parseFloat(localStorage.getItem('totalSpent') || '0');
    }
  });

  const { data: potentialPayouts = 0 } = useQuery({
    queryKey: ['potential-payouts'],
    queryFn: async () => {
      return parseFloat(localStorage.getItem('potentialEarnings') || '0');
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
                <div className="text-3xl font-bold">KES {totalBalance}</div>
                <p className="text-sm text-gray-500">From bid purchases</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Potential Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">KES {potentialPayouts}</div>
                <p className="text-sm text-gray-500">From active tasks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">KES {totalBalance - potentialPayouts}</div>
                <p className="text-sm text-gray-500">Revenue - Potential Payouts</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminFinances;