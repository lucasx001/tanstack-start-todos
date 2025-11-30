import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/supabase";

const schema = z.object({
  id: z.string(),
});

const getSpecificTodo = createServerFn({ method: "GET" })
  .inputValidator(schema)
  .handler(async ({ data }) => {
    const supabaseClient = getSupabaseServerClient();
    const todo = await supabaseClient
      .from("todos")
      .select("id, title, isCompleted")
      .eq("id", data.id)
      .single();

    return todo.data;
  });

export const Route = createFileRoute("/todo/$id")({
  component: RouteComponent,
  loader: ({ params }) => getSpecificTodo({ data: { id: params.id } }),
});

function RouteComponent() {
  const todo = Route.useLoaderData();

  if (!todo) {
    return <div>Todo not found</div>;
  }

  return (
    <div>
      <h1>{todo.title}</h1>
      <p>{todo.isCompleted ? "Completed" : "Not Completed"}</p>
    </div>
  );
}
