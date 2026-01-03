import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { ModalDeleteTodo } from "@/components/modal-delete-todo";
import { ModalEditTodo } from "@/components/modal-edit-todo";
import { ModalNewTodo } from "@/components/modal-new-todo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { listTodos } from "@/server-function/todos/list";
import type { Database } from "@/types/database.types";

export const Route = createFileRoute("/_authenticated/todo/")({
  component: RouteComponent,
  loader: async () => {
    const todos = await listTodos();

    return { todos };
  },
});

type TodoItem = Omit<
  Database["public"]["Tables"]["todos"]["Row"],
  "created_at" | "user_id"
>;

interface ModalDeleteTodoProps {
  type: "delete";
  id: string;
}

interface ModalAddTodoProps {
  type: "add";
}

interface ModalEditTodoProps {
  type: "edit";
  todo: TodoItem;
}

export type ModalData =
  | ModalAddTodoProps
  | ModalEditTodoProps
  | ModalDeleteTodoProps;

function RouteComponent() {
  const { todos } = Route.useLoaderData();
  const [modal, setModal] = useState<ModalData | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.todos.list(),
    queryFn: listTodos,
    initialData: todos,
  });

  return (
    <div className="p-4 w-screen h-screen flex flex-col items-center gap-4">
      <div className="space-y-4">
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setModal({ type: "add" });
          }}
        >
          <span>Add Todo</span>
          <PlusIcon />
        </Button>
        <Card className="min-w-[400px] max-w-[800px]">
          <CardHeader>
            <CardTitle>Your todos</CardTitle>
            <CardDescription>
              this is your todo list, you can edit them below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {
              isLoading ? <LoadingSkeleton /> : (<ul>
              {data.map((todo) => (
                <li
                  key={todo.id}
                  className={cn(
                    "p-2 flex items-center justify-between",
                    todo.isCompleted && "line-through",
                  )}
                >
                  <Link to={todo.id}>
                    <span className="hover:underline hover:underline-offset-4">{todo.title}</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setModal({ type: "edit", todo });
                      }}
                    >
                      <SquarePenIcon />
                    </Button>
                    <Button
                      onClick={() => {
                        setModal({ type: "delete", id: todo.id });
                      }}
                      variant="ghost"
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>)
            }

          </CardContent>
        </Card>
      </div>

      {modal?.type === "add" && (
        <ModalNewTodo
          onDismiss={() => {
            setModal(null);
          }}
        />
      )}
      {modal?.type === "edit" && (
        <ModalEditTodo
          initialValues={modal.todo}
          onDismiss={() => {
            setModal(null);
          }}
        />
      )}
      {modal?.type === "delete" && (
        <ModalDeleteTodo
          id={modal.id}
          onDismiss={() => {
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
