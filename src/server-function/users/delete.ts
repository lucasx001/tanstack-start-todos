import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getSupabaseServerClient } from "@/supabase";

export const deleteUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data: { id } }) => {
    await getSupabaseServerClient()
      .from("users")
      .delete()
      .eq("clerk_user_id", id);
  });
