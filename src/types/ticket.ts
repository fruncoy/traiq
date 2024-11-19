export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatus = 'pending' | 'in-progress' | 'resolved';

export interface TicketResponse {
  id: string;
  message: string;
  createdAt: string;
  isAdmin: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  attachment?: string;
  taskerId: string;
  createdAt: string;
  responses: TicketResponse[];
}