import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TaskerAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
    
    if (isLogin) {
      const tasker = taskers.find((t: any) => t.username === username && t.password === password);
      if (tasker) {
        localStorage.setItem('currentTasker', JSON.stringify(tasker));
        toast.success("Successfully logged in!");
        navigate("/tasker");
      } else {
        toast.error("Invalid credentials");
      }
    } else {
      // Generate unique tasker ID
      const taskerId = `TSK${Date.now().toString().slice(-6)}`;
      
      const newTasker = {
        id: taskerId,
        username,
        password,
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
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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