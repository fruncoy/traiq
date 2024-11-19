import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Ticket, TicketPriority } from "@/types/ticket";

const TicketForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low" as TicketPriority,
    attachment: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTicket: Ticket = {
      id: Date.now().toString(),
      ...formData,
      taskerId: 'current-user-id',
      status: 'pending',
      createdAt: new Date().toISOString(),
      responses: []
    };

    const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    localStorage.setItem('tickets', JSON.stringify([...existingTickets, newTicket]));

    queryClient.invalidateQueries({ queryKey: ['tickets'] });
    
    setFormData({
      title: "",
      description: "",
      priority: "low",
      attachment: ""
    });

    toast.success("Ticket submitted successfully");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, attachment: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a Support Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter ticket title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your issue..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority Level</label>
            <Select
              value={formData.priority}
              onValueChange={(value: TicketPriority) => 
                setFormData(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Attachment (optional)</label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>

          <Button type="submit" className="w-full">Submit Ticket</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TicketForm;