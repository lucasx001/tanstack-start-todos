import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getSupabaseServerClient } from "@/supabase";

export const updateTodo = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      isCompleted: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    await getSupabaseServerClient()
      .from("todos")
      .update({ isCompleted: data.isCompleted, title: data.title })
      .eq("id", data.id);
  });
