import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MetricProps {
  label: string;
  value: string | number | ((profile: any) => string | number);
  change?: string;
  description?: string;
}

const DashboardMetrics = ({ metrics }: { metrics: MetricProps[] }) => {
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          task_submissions(status),
          task_bidders(task_id)
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
            task_submissions(status),
            task_bidders(task_id)
          `)
          .single();

        if (createError) throw createError;
        return newProfile;
      }

      return {
        ...profile,
        completedTasks: profile.task_submissions?.filter(s => s.status === 'approved').length || 0,
        activeBids: profile.task_bidders?.length || 0
      };
    }
  });

  const renderMetricValue = (metric: MetricProps) => {
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