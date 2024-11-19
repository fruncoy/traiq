import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import { Ticket, TicketStatus } from "@/types/ticket";

const AdminTickets = () => {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState("");

  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const storedTickets = localStorage.getItem('tickets');
      return storedTickets ? JSON.parse(storedTickets) : [];
    }
  });

  const filteredTickets = tickets.filter((ticket: Ticket) => 
    statusFilter === 'all' || ticket.status === statusFilter
  );

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    const updatedTickets = tickets.map((ticket: Ticket) => 
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    );
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    toast.success("Ticket status updated");
  };

  const handleResponse = async () => {
    if (!selectedTicket || !response.trim()) return;

    const newResponse = {
      id: Date.now().toString(),
      message: response,
      createdAt: new Date().toISOString(),
      isAdmin: true
    };

    const updatedTickets = tickets.map((ticket: Ticket) => 
      ticket.id === selectedTicket.id 
        ? { ...ticket, responses: [...ticket.responses, newResponse] }
        : ticket
    );

    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    setResponse("");
    toast.success("Response sent successfully");
  };

  return (
    <Sidebar isAdmin>
      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Support Tickets</CardTitle>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket: Ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>
                      <Badge variant={
                        ticket.priority === 'high' ? 'destructive' :
                        ticket.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={ticket.status} 
                        onValueChange={(value: TicketStatus) => handleStatusChange(ticket.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{ticket.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm text-gray-600">{ticket.description}</p>
                            </div>
                            {ticket.attachment && (
                              <div>
                                <h4 className="font-medium mb-2">Attachment</h4>
                                <a 
                                  href={ticket.attachment} 
                                  className="text-blue-600 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View Attachment
                                </a>
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium mb-2">Responses</h4>
                              <div className="space-y-3">
                                {ticket.responses?.map((response) => (
                                  <div 
                                    key={response.id}
                                    className={`p-3 rounded-lg ${
                                      response.isAdmin 
                                        ? 'bg-blue-50 ml-4' 
                                        : 'bg-gray-50 mr-4'
                                    }`}
                                  >
                                    <p className="text-sm">{response.message}</p>
                                    <span className="text-xs text-gray-500">
                                      {new Date(response.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Add Response</h4>
                              <Textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                placeholder="Type your response..."
                                className="mb-2"
                              />
                              <Button onClick={handleResponse}>Send Response</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default AdminTickets;