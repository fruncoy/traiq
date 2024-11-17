import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import Sidebar from "../Sidebar";

const SubmitTaskPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Task submitted successfully!");
      setFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Sidebar>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Completed Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Task File</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!file || uploading}
                    className="flex items-center gap-2"
                  >
                    <Upload size={16} />
                    {uploading ? "Uploading..." : "Submit"}
                  </Button>
                </div>
                {file && (
                  <p className="text-sm text-gray-600">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default SubmitTaskPage;