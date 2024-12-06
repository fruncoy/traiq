import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSection } from "./ProfileSection";
import { SecuritySection } from "./SecuritySection";
import { MyTickets } from "./MyTickets";

const TaskerSettings = () => {
  return (
    <div className="h-full">
      <Tabs defaultValue="profile" className="h-full space-y-6">
        <div className="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="profile" className="border-none p-0 outline-none">
          <ProfileSection />
        </TabsContent>
        <TabsContent value="security" className="border-none p-0 outline-none">
          <SecuritySection />
        </TabsContent>
        <TabsContent value="tickets" className="border-none p-0 outline-none">
          <MyTickets />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskerSettings;