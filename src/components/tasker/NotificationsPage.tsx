import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Sidebar from "../Sidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
    refetchInterval: 30000
  });

  const clearNotificationsMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) return;
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notifications cleared successfully');
    },
    onError: () => {
      toast.error('Failed to clear notifications');
    }
  });

  return (
    <Sidebar>
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <Button 
              variant="outline"
              onClick={() => clearNotificationsMutation.mutate()}
              disabled={notifications.length === 0 || clearNotificationsMutation.isPending}
            >
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No notifications yet</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-2">
                        <h3 className="font-semibold text-[#1E40AF]">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${
                          notification.type === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : notification.type === 'error'
                            ? 'bg-red-100 text-red-800'
                            : notification.type === 'deadline_warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(notification.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default NotificationsPage;