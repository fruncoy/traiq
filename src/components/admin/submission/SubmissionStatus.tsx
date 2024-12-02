import { cn } from "@/lib/utils";

interface SubmissionStatusProps {
  status: string;
}

export const SubmissionStatus = ({ status }: SubmissionStatusProps) => {
  return (
    <span className={cn("px-2 py-1 rounded-full text-xs", {
      "bg-green-100 text-green-800": status === "approved",
      "bg-red-100 text-red-800": status === "rejected",
      "bg-yellow-100 text-yellow-800": status === "pending"
    })}>
      {status}
    </span>
  );
};