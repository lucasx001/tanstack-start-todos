import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getSupabaseServerClient } from "@/supabase";

export const deleteTodo = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    await getSupabaseServerClient().from("todos").delete().eq("id", data.id);
  });
