import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const TicketForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    attachment: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.priority) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newTicket = {
      id: Date.now().toString(),
      taskerId: 'current-user-id',
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      attachment: formData.attachment,
      status: 'pending',
      createdAt: new Date().toISOString(),
      responses: []
    };

    // Save to localStorage
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    localStorage.setItem('tickets', JSON.stringify([...tickets, newTicket]));

    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "",
      attachment: ""
    });

    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: ['tickets'] });

    toast.success("Ticket submitted successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter ticket title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your issue or request"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority Level</label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData(prev => ({ ...prev, attachment: reader.result as string }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          <Button type="submit">Submit Ticket</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TicketForm;