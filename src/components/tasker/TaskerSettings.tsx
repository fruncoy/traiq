import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "../Sidebar";
import ProfileSection from "./ProfileSection";
import SecuritySection from "./SecuritySection";
import MyTickets from "./MyTickets";

const TaskerSettings = () => {
  return (
    <Sidebar fixed>
      <div className="space-y-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <div className="space-between flex items-center">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="profile" className="space-y-6">
            <ProfileSection />
          </TabsContent>
          <TabsContent value="security" className="space-y-6">
            <SecuritySection />
          </TabsContent>
          <TabsContent value="tickets" className="space-y-6">
            <MyTickets />
          </TabsContent>
        </Tabs>
      </div>
    </Sidebar>
  );
};

export default TaskerSettings;