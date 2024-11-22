import { ImageIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  image?: string;
}

export const EmptyState = ({ title, description, image }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {image ? (
        <img 
          src={image} 
          alt="Empty state illustration" 
          className="w-64 h-48 object-cover rounded-lg mb-4 opacity-80"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm">{description}</p>
    </div>
  );
};