import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getSupabaseServerClient } from "@/supabase";

export const updateUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({ email: z.email(), username: z.string(), id: z.string() }),
  )
  .handler(async ({ data: { id, email, username } }) => {
    const { data } = await getSupabaseServerClient()
      .from("users")
      .update({
        clerk_user_id: id,
        email,
        name: username,
      })
      .select("id").limit(1).single();

    if (!data?.id) {
      throw new Error("Failed to create user.");
    }

    return data.id;
  });
