import { UseMutateFunction } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface TaskUploadProps {
  uploadMutation: UseMutateFunction<unknown, Error, File, unknown>;
}

export const TaskUpload = ({ uploadMutation }: TaskUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

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
      setIsUploading(true);
      const toastId = toast.loading("Uploading tasks...", { 
        position: "bottom-right",
      });

      await uploadMutation(file);
      
      toast.success("Tasks uploaded successfully", { 
        id: toastId,
        position: "bottom-right",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        `Upload failed: ${error instanceof Error ? error.message : "Please check the file format"}. Required columns: UniqueCode, Title, Category (genai/creai)`,
        { position: "bottom-right" }
      );
    } finally {
      setIsUploading(false);
      if (input) input.value = ''; // Reset input
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
      disabled={isUploading}
    >
      {isUploading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Upload className="h-4 w-4" />
      )}
      {isUploading ? "Uploading..." : "Upload Tasks"}
    </Button>
  );
};