import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import { createTodo } from "@/server-function/todos/create";
import { LoadingButton } from "./loading-button";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface Props {
  onDismiss?: () => void;
}

export function ModalNewTodo({ onDismiss }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (title: string) => {
      await createTodo({ data: { title } });
    },
    onSuccess: () => {
      toast("Create todo successfully.");
      qc.invalidateQueries({ queryKey: queryKeys.todos.list() });
      setIsOpen(false);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        onAnimationEndCapture={() => {
          if (!isOpen) {
            onDismiss?.();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>New todo</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div>
          <Input placeholder="Input todo title" ref={inputRef} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
          <LoadingButton
            isPending={isPending}
            onClick={() => {
              mutate(inputRef.current?.value ?? "");
            }}
          >
            New
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
