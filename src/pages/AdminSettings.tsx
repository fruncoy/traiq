import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const adminUsers: AdminUser[] = [
  {
    id: "1",
    name: "Admin One",
    email: "admin1@example.com",
    role: "Super Admin"
  },
  {
    id: "2",
    name: "Admin Two",
    email: "admin2@example.com",
    role: "Admin"
  }
];

const AdminSettings = () => {
  const handleSaveChanges = () => {
    toast.success("Settings saved successfully");
  };

  const handleDeleteAdmin = (adminId: string) => {
    toast.success("Admin account deleted successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Platform Settings</h2>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="admins">Admin Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Name</Label>
                    <Input id="admin-name" defaultValue="John Admin" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@example.com" />
                  </div>
                  <Button onClick={handleSaveChanges} className="text-white bg-primary hover:bg-primary/90">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admins">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminUsers.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell>{admin.name}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>{admin.role}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-white bg-primary hover:bg-primary/90"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="text-white bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminSettings;