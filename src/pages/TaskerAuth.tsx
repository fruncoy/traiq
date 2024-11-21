import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Tasker {
  id: string;
  username: string;
  email: string;
  password: string;
  bids: number;
  tasksCompleted: number;
  totalPayouts: number;
  pendingPayouts: number;
  joinDate: string;
  isSuspended: boolean;
}

const TaskerAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
    
    if (isLogin) {
      const tasker = taskers.find((t: Tasker) => 
        t.username === formData.username && t.password === formData.password
      );
      
      if (tasker) {
        localStorage.setItem('currentTasker', JSON.stringify(tasker));
        toast.success("Successfully logged in!");
        navigate("/tasker");
      } else {
        toast.error("Invalid credentials");
      }
    } else {
      // Check if username already exists
      if (taskers.some((t: Tasker) => t.username === formData.username)) {
        toast.error("Username already exists");
        return;
      }

      // Generate unique tasker ID with TSK prefix and 6 random digits
      const taskerId = `TSK${Math.floor(Math.random() * 900000 + 100000)}`;
      
      const newTasker: Tasker = {
        id: taskerId,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        bids: 0,
        tasksCompleted: 0,
        totalPayouts: 0,
        pendingPayouts: 0,
        joinDate: new Date().toISOString(),
        isSuspended: false
      };
      
      taskers.push(newTasker);
      localStorage.setItem('taskers', JSON.stringify(taskers));
      localStorage.setItem('currentTasker', JSON.stringify(newTasker));
      
      toast.success("Account created successfully!");
      navigate("/tasker");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Tasker Login" : "Create Tasker Account"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
            <p className="text-center text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskerAuth;