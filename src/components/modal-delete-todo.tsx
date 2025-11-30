import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { queryKeys } from "@/lib/query-keys";
import { deleteTodo } from "@/server-function/todos/delete";
import { LoadingButton } from "./loading-button";
import { Button } from "./ui/button";

interface Props {
  id: string;
  onDismiss?: () => void;
}

export function ModalDeleteTodo({ id, onDismiss }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await deleteTodo({ data: { id } });
    },
    onSuccess: () => {
      toast.success("Todo deleted successfully");
      qc.invalidateQueries({ queryKey: queryKeys.todos.list() });
      setIsOpen(false);
    },
  });
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent
        onAnimationEndCapture={() => {
          if (!isOpen) {
            onDismiss?.();
          }
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Button>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction>
            <LoadingButton
              isPending={isPending}
              variant="destructive"
              onClick={() => {
                mutate();
              }}
            >
              Confirm
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
