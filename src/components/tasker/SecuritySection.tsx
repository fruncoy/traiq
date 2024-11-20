import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SecuritySection = () => {
  const handlePasswordChange = () => {
    toast.success("Password changed successfully");
  };

  return (
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
        <Button 
          onClick={handlePasswordChange}
          className="bg-white text-[#1E40AF] border border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"
        >
          Change Password
        </Button>
      </CardContent>
    </Card>
  );
};

export default SecuritySection;