import { UseMutateFunction } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface TaskUploadProps {
  uploadMutation: UseMutateFunction<unknown, Error, File, unknown>;
}

export const TaskUpload = ({ uploadMutation }: TaskUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
        input.onchange = (e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>);
        input.click();
      }}
    >
      Upload Tasks
    </Button>
  );
};