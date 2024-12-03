import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

interface TaskUploadProps {
  uploadMutation: UseMutationResult<any, Error, File, unknown>;
}

export const TaskUpload = ({ uploadMutation }: TaskUploadProps) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Button className="flex items-center gap-2">
        <Upload size={16} />
        Upload Tasks
      </Button>
    </div>
  );
};