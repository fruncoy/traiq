interface Task {
  id: string;
  title: string;
  description: string;
  payout: number;
  deadline: string;
  status: "active" | "assigned" | "completed";
}

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">Tasks</h3>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-neutral-800">{task.title}</h4>
                  <p className="mt-1 text-sm text-neutral-800">{task.description}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-white">
                  ${task.payout}
                </span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-neutral-800">Due: {task.deadline}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.status === "active" ? "bg-green-100 text-green-800" :
                  task.status === "assigned" ? "bg-yellow-100 text-yellow-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;