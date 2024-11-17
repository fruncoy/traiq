import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

interface Transaction {
  id: string;
  taskTitle: string;
  tasker: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    taskTitle: "Translate Short Stories",
    tasker: "John Doe",
    amount: 2000,
    status: "pending",
    date: "2024-02-20"
  },
  {
    id: "2",
    taskTitle: "Cultural Essays",
    tasker: "Jane Smith",
    amount: 3000,
    status: "completed",
    date: "2024-02-19"
  }
];

const AdminFinances = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Financial Management</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ksh 125,000</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ksh 45,000</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Completed Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Tasker</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.taskTitle}</TableCell>
                      <TableCell>{transaction.tasker}</TableCell>
                      <TableCell>Ksh {transaction.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "completed" ? "default" :
                            transaction.status === "pending" ? "secondary" : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        {transaction.status === "pending" && (
                          <Button size="sm" variant="outline">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Process
                          </Button>
                        )}
                      </TableCell>
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