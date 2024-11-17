interface MetricProps {
  label: string;
  value: string | number;
  change?: string;
}

const DashboardMetrics = ({ metrics }: { metrics: MetricProps[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-neutral-800">{metric.label}</p>
          <p className="mt-2 text-3xl font-semibold text-primary-DEFAULT">
            {metric.value}
          </p>
          {metric.change && (
            <p className="mt-2 text-sm text-green-600">{metric.change}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;