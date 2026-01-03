import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/supabase";
export interface TodoListItem {
    id: string;
    title: string;
    isCompleted: boolean;
}

export const listTodos = createServerFn({ method: "GET" }).handler(async () => {
  const todos = await getSupabaseServerClient()
    .from("todos")
    .select("id, title, isCompleted")
    .order("created_at");

  return todos.data ?? [];
});
