import { useResetSystem } from "./mutations/useResetSystem";
import { useTaskDelete } from "./mutations/useTaskDelete";
import { useTaskStatusToggle } from "./mutations/useTaskStatusToggle";
import { useTaskUpload } from "./mutations/useTaskUpload";

export const useTaskMutations = () => {
  const resetSystemMutation = useResetSystem();
  const deleteMutation = useTaskDelete();
  const toggleStatusMutation = useTaskStatusToggle();
  const uploadMutation = useTaskUpload();

  return {
    resetSystemMutation,
    deleteMutation,
    toggleStatusMutation,
    uploadMutation
  };
};