import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/supabase";

export const listTodos = createServerFn({ method: "GET" }).handler(async () => {
  const todos = await getSupabaseServerClient()
    .from("todos")
    .select("id, title, isCompleted")
    .order("created_at");

  return todos.data ?? [];
});
