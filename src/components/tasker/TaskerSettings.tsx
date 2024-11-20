import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MyTickets from "./MyTickets";
import TicketForm from "./TicketForm";
import ProfileSection from "./ProfileSection";
import PaymentSection from "./PaymentSection";
import SecuritySection from "./SecuritySection";

const TaskerSettings = () => {
  return (
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
  );
};

export default TaskerSettings;