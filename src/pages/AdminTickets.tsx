import Sidebar from "../components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EmptyState } from "@/components/task/EmptyState";
import { Ticket } from "@/types/ticket";

const AdminTickets = () => {
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      return tickets;
    }
  });

  const { data: taskers = [] } = useQuery({
    queryKey: ['taskers'],
    queryFn: async () => {
      return JSON.parse(localStorage.getItem('taskers') || '[]');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: string }) => {
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      const updatedTickets = tickets.map((t: Ticket) => 
        t.id === ticketId ? { ...t, status } : t
      );
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));

      // Add notification for the tasker
      const ticket = tickets.find((t: Ticket) => t.id === ticketId);
      if (ticket) {
        const notifications = JSON.parse(localStorage.getItem(`notifications_${ticket.taskerId}`) || '[]');
        notifications.unshift({
          id: Date.now().toString(),
          title: 'Ticket Status Updated',
          message: `Your ticket #${ticket.id} status has been updated to ${status}`,
          type: 'info',
          read: false,
          date: new Date().toISOString(),
          taskerId: ticket.taskerId
        });
        localStorage.setItem(`notifications_${ticket.taskerId}`, JSON.stringify(notifications));
      }

      return updatedTickets;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket status updated successfully');
    }
  });

  const getTaskerUsername = (taskerId: string) => {
    const tasker = taskers.find((t: any) => t.id === taskerId);
    return tasker?.username || 'Unknown';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#1E40AF] mb-6">Admin Tickets</h2>
          <Card>
            <CardContent className="p-0">
              {tickets.length === 0 ? (
                <EmptyState
                  title="No tickets yet"
                  description="When taskers submit tickets, they will appear here"
                  image="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tasker</TableHead>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map(ticket => (
                      <TableRow key={ticket.id}>
                        <TableCell>{getTaskerUsername(ticket.taskerId)}</TableCell>
                        <TableCell>{ticket.id}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={ticket.status}
                            onValueChange={(value) => 
                              updateStatusMutation.mutate({ ticketId: ticket.id, status: value })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">View Details</Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                              <DialogHeader>
                                <DialogTitle>Ticket Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p><strong>ID:</strong> {ticket.id}</p>
                                <p><strong>Subject:</strong> {ticket.title}</p>
                                <p><strong>Description:</strong> {ticket.description}</p>
                                <p><strong>Status:</strong> {ticket.status}</p>
                                <p><strong>Tasker:</strong> {getTaskerUsername(ticket.taskerId)}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
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

export default AdminTickets;