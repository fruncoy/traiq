import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskCategory } from "@/types/task";

interface TaskFiltersProps {
  selectedCategory: TaskCategory | 'all';
  onCategoryChange: (category: TaskCategory | 'all') => void;
}

const TaskFilters = ({ selectedCategory, onCategoryChange }: TaskFiltersProps) => {
  return (
    <div className="mb-6">
      <Select value={selectedCategory} onValueChange={(value) => onCategoryChange(value as TaskCategory | 'all')}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="short_essay">Short Essay</SelectItem>
          <SelectItem value="long_essay">Long Essay</SelectItem>
          <SelectItem value="item_listing">Item Listing</SelectItem>
          <SelectItem value="voice_recording">Voice Recording</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskFilters;