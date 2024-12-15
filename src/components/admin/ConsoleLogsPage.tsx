import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import Sidebar from "../Sidebar";
import { SystemLog } from "@/integrations/supabase/types/logs";
import { LoadingSpinner } from "../ui/loading-spinner";
import { toast } from "sonner";

const ConsoleLogsPage = () => {
  const { data: logs = [], isLoading, error } = useQuery<SystemLog[]>({
    queryKey: ['console-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*, profiles(email)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching logs:', error);
        toast.error("Failed to fetch system logs");
        throw error;
      }
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <Sidebar isAdmin>
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <LoadingSpinner />
        </div>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar isAdmin>
        <div className="container mx-auto py-6">
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">Error loading system logs: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Sidebar isAdmin>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(log.created_at || ''), 'MMM dd, yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {log.user_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {log.profiles?.email || 'System'}
                    </TableCell>
                    <TableCell className="max-w-xl">
                      <div className="break-words">
                        {log.message}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No system logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default ConsoleLogsPage;