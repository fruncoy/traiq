import { UseMutateFunction } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface TaskUploadProps {
  uploadMutation: UseMutateFunction<unknown, Error, File, unknown>;
}

export const TaskUpload = ({ uploadMutation }: TaskUploadProps) => {
  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      uploadMutation(file);
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
    >
      Upload Tasks
    </Button>
  );
};