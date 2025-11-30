import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getSupabaseServerClient } from "@/supabase";

export const createTodo = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      title: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    await getSupabaseServerClient()
      .from("todos")
      .insert({ isCompleted: false, title: data.title });
  });
