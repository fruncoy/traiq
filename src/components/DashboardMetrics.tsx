import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MetricProps {
  label: string;
  value: string | number | ((profile: any) => string | number);
  change?: string;
  description?: string;
}

const DashboardMetrics = ({ metrics }: { metrics: MetricProps[] }) => {
  // Query to get total tasks count
  const { data: tasksCount = 0 } = useQuery({
    queryKey: ['total-tasks-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    }
  });

  // Query to get current user's profile and related data
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          task_submissions!left (
            status,
            submitted_at
          ),
          task_bidders!left (
            task_id,
            bid_date
          )
        `)
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, email: user.email }])
          .select(`
            *,
            task_submissions!left (
              status,
              submitted_at
            ),
            task_bidders!left (
              task_id,
              bid_date
            )
          `)
          .single();

        if (createError) throw createError;
        return newProfile;
      }

      return profile;
    }
  });

  // Query to get today's submissions count
  const { data: todaySubmissions = 0 } = useQuery({
    queryKey: ['today-submissions-count'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count, error } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('submitted_at', today.toISOString());

      if (error) throw error;
      return count || 0;
    }
  });

  // Query to get pending submissions count
  const { data: pendingSubmissions = 0 } = useQuery({
    queryKey: ['pending-submissions-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) throw error;
      return count || 0;
    }
  });

  const renderMetricValue = (metric: MetricProps) => {
    if (metric.label === "Total Tasks") {
      return tasksCount;
    }
    if (metric.label === "Today's Submissions") {
      return todaySubmissions;
    }
    if (metric.label === "Pending Reviews") {
      return pendingSubmissions;
    }
    if (metric.label === "Available Bids") {
      return currentUser?.bids || 0;
    }
    if (metric.label === "Pending Payouts") {
      return `KES ${currentUser?.pending_payouts || 0}`;
    }
    if (metric.label === "Total Earned") {
      return `KES ${currentUser?.total_payouts || 0}`;
    }
    
    if (typeof metric.value === 'function') {
      return currentUser ? metric.value(currentUser) : '-';
    }
    return metric.value;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-gray-600">{metric.label}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {renderMetricValue(metric)}
          </p>
          {metric.description && (
            <p className="mt-1 text-sm text-gray-500">{metric.description}</p>
          )}
          {metric.change && (
            <p className="mt-2 text-sm text-green-600">{metric.change}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;