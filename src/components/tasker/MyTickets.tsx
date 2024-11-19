import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Ticket, TicketResponse } from "@/types/ticket";

const MyTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState("");

  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const storedTickets = localStorage.getItem('tickets');
      const allTickets = storedTickets ? JSON.parse(storedTickets) : [];
      return allTickets.filter((ticket: Ticket) => ticket.taskerId === 'current-user-id');
    }
  });

  const handleAddResponse = async () => {
    if (!selectedTicket || !response.trim()) return;

    const newResponse: TicketResponse = {
      id: Date.now().toString(),
      message: response,
      createdAt: new Date().toISOString(),
      isAdmin: false
    };

    const allTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const updatedTickets = allTickets.map((ticket: Ticket) => 
      ticket.id === selectedTicket.id 
        ? { ...ticket, responses: [...ticket.responses, newResponse] }
        : ticket
    );

    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    setResponse("");
    toast.success("Response added successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Support Tickets</CardTitle>
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
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket: Ticket) => (
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
                    <Badge variant={
                      ticket.status === 'resolved' ? 'default' :
                      ticket.status === 'in-progress' ? 'secondary' : 'outline'
                    }>
                      {ticket.status}
                    </Badge>
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
                            <Button onClick={handleAddResponse}>Send Response</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MyTickets;