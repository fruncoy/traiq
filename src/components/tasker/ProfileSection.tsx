import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getCurrentTasker, updateCurrentTasker } from "@/utils/auth";

const ProfileSection = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const currentTasker = getCurrentTasker();
    if (currentTasker) {
      setFormData({
        username: currentTasker.username || "",
        email: currentTasker.email || "",
        phone: currentTasker.phone || "",
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = () => {
    const currentTasker = getCurrentTasker();
    if (!currentTasker) return;

    const updatedTasker = {
      ...currentTasker,
      ...formData
    };
    
    updateCurrentTasker(updatedTasker);
    toast.success("Profile updated successfully");
  };

  return (
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
  );
};

export default ProfileSection;
