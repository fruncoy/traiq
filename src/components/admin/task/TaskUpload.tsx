import { UseMutateFunction } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface TaskUploadProps {
  uploadMutation: UseMutateFunction<unknown, Error, File, unknown>;
}

export const TaskUpload = ({ uploadMutation }: TaskUploadProps) => {
  const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    // Check file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(fileExtension || '')) {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      toast.loading("Uploading tasks...", { id: "task-upload" });
      await uploadMutation(file);
      toast.success("Tasks uploaded successfully", { id: "task-upload" });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload tasks. Please try again.",
        { id: "task-upload" }
      );
    }
  };

  return (
    <Button
      variant="outline"
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls';
        input.onchange = handleFileChange;
        input.click();
      }}
      className="flex items-center gap-2"
    >
      <Upload className="h-4 w-4" />
      Upload Tasks
    </Button>
  );
};