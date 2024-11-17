interface MetricProps {
  label: string;
  value: string | number;
  change?: string;
  description?: string;
}

const DashboardMetrics = ({ metrics }: { metrics: MetricProps[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-gray-600">{metric.label}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {metric.value}
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