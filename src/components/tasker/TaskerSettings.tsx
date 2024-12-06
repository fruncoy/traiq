import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyTickets from "./MyTickets";
import TicketForm from "./TicketForm";
import ProfileSection from "./ProfileSection";
import PaymentSection from "./PaymentSection";
import SecuritySection from "./SecuritySection";

const TaskerSettings = () => {
  return (
    <div className="h-full overflow-hidden">
      <div className="container mx-auto p-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentSection />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySection />
          </TabsContent>

          <TabsContent value="tickets">
            <div className="space-y-6">
              <TicketForm />
              <MyTickets />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskerSettings;