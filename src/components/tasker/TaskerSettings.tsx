import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const TaskerSettings = () => {
  const [formData, setFormData] = useState({
    username: "johndoe",
    email: "john@example.com",
    phone: "+254 700 000000",
    mpesaNumber: "+254 700 000000"
  });

  const { data: userEarnings = 0 } = useQuery({
    queryKey: ['user-earnings'],
    queryFn: async () => {
      const earnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
      return earnings['current-user-id'] || 0;
    },
    refetchInterval: 5000
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };

  const handleWithdraw = () => {
    toast.success("Withdrawal request submitted");
  };

  return (
    <Tabs defaultValue="profile">
      <TabsList className="mb-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input 
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <Button 
              onClick={handleSaveProfile}
              className="bg-white text-[#1E40AF] border border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payment">
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">M-Pesa Number</label>
              <Input 
                type="tel"
                name="mpesaNumber"
                value={formData.mpesaNumber}
                onChange={handleChange}
              />
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Available Balance</span>
                  <span className="font-semibold">KES {userEarnings}</span>
                </div>
                <Input type="number" placeholder="Enter amount to withdraw" />
                <Button 
                  onClick={handleWithdraw} 
                  className="w-full bg-white text-[#1E40AF] border border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"
                >
                  Withdraw to M-Pesa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input type="password" />
            </div>
            <Button className="bg-white text-[#1E40AF] border border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white">
              Change Password
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TaskerSettings;