import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX } from "lucide-react";

interface Tasker {
  id: string;
  name: string;
  tasksCompleted: number;
  bidsPlaced: number;
  earnings: number;
  status: "active" | "pending" | "suspended";
  joinDate: string;
}

const taskers: Tasker[] = [
  {
    id: "1",
    name: "John Doe",
    tasksCompleted: 15,
    bidsPlaced: 25,
    earnings: 45000,
    status: "active",
    joinDate: "2024-01-15"
  },
  {
    id: "2",
    name: "Jane Smith",
    tasksCompleted: 8,
    bidsPlaced: 12,
    earnings: 24000,
    status: "pending",
    joinDate: "2024-02-01"
  }
];

const AdminTaskers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Tasker Management</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Taskers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Active Taskers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tasker List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                    <TableHead>Bids Placed</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskers.map((tasker) => (
                    <TableRow key={tasker.id}>
                      <TableCell>{tasker.name}</TableCell>
                      <TableCell>{tasker.tasksCompleted}</TableCell>
                      <TableCell>{tasker.bidsPlaced}</TableCell>
                      <TableCell>Ksh {tasker.earnings}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tasker.status === "active" ? "default" :
                            tasker.status === "pending" ? "secondary" : "destructive"
                          }
                        >
                          {tasker.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{tasker.joinDate}</TableCell>
                      <TableCell>
                        {tasker.status === "pending" ? (
                          <Button size="sm" variant="outline" className="text-green-600">
                            <UserCheck className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        ) : tasker.status === "active" && (
                          <Button size="sm" variant="outline" className="text-red-600">
                            <UserX className="h-4 w-4 mr-2" />
                            Suspend
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

export default AdminTaskers;