import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface TaskBidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export const TaskBidDialog = ({ open, onOpenChange, onConfirm, isPending }: TaskBidDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border border-gray-200 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">Confirm Bid</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to place a bid on this task? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? <LoadingSpinner size="small" /> : "Confirm Bid"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};