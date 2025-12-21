import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import { updateTodo } from "@/server-function/todos/update";
import type { Database } from "@/types/database.types";
import { LoadingButton } from "./loading-button";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
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
import { Label } from "./ui/label";

interface Props {
  onDismiss?: () => void;
  initialValues: Omit<
    Database["public"]["Tables"]["todos"]["Row"],
    "created_at" | "user_id"
  >;
}

export function ModalEditTodo({ onDismiss, initialValues }: Props) {
  const { id, title, isCompleted } = initialValues;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isChecked, setIsChecked] = useState(isCompleted);

  const [open, setIsOpen] = useState(true);

  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      title,
      isCompleted,
    }: {
      title: string;
      isCompleted: boolean;
    }) => {
      await updateTodo({ data: { id, title, isCompleted } });
    },
    onSuccess: () => {
      toast("Edit todo successfully!!!");
      qc.invalidateQueries({ queryKey: queryKeys.todos.list() });
      setIsOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent
        onAnimationEndCapture={() => {
          if (!open) {
            onDismiss?.();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit todo</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Input todo title"
            ref={inputRef}
            defaultValue={title}
          />
          <div className="flex items-center gap-2">
            {/** biome-ignore lint/correctness/useUniqueElementIds: no why */}
            <Checkbox
              id="completed"
              checked={isChecked}
              onCheckedChange={(checked) => {
                if (typeof checked === "boolean") {
                  setIsChecked(checked);
                }
              }}
            />
            <Label htmlFor="completed">Mark as completed.</Label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button>Close</Button>
          </DialogClose>
          <LoadingButton
            isPending={isPending}
            onClick={() => {
              mutate({
                title: inputRef.current?.value ?? "",
                isCompleted: isChecked ?? false,
              });
            }}
          >
            Update
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
