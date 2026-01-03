import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import { createTodo } from "@/server-function/todos/create";
import type { TodoListItem } from "@/server-function/todos/list";
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
      return await createTodo({ data: { title } });
    },
    onSuccess: (data) => {
      toast("Create todo successfully.");
      qc.setQueryData<TodoListItem[]>(queryKeys.todos.list(), (oldData) => {
        if (!oldData) {
          return
        }

        return [...oldData, data]
      })
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
            <Button variant="outline">Close</Button>
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
