import { useDropzone } from 'react-dropzone';

interface FileUploadSectionProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  isDeadlineApproaching: boolean;
  deadline?: Date;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const FileUploadSection = ({ file, onFileChange, isDeadlineApproaching, deadline }: FileUploadSectionProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      onFileChange(file);
    },
    maxSize: MAX_FILE_SIZE,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload File (Max 10MB)</label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${file ? 'bg-green-50 border-green-500' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : file ? (
            <p className="text-green-600">Selected: {file.name}</p>
          ) : (
            <p>Drag and drop a file here, or click to select</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
          </p>
        </div>
      </div>
      {deadline && (
        <p className={`text-sm ${!isSubmissionAllowed(deadline) ? 'text-red-500' : 
          isDeadlineApproaching ? 'text-orange-500' : 'text-gray-500'}`}>
          Deadline: {deadline.toLocaleString()} EAT
        </p>
      )}
    </div>
  );
};