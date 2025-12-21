import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getSupabaseServerClient } from "@/supabase";

export const createUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({ email: z.email(), username: z.string(), id: z.string() }),
  )
  .handler(async ({ data: { id, email, username } }) => {
    const { data } = await getSupabaseServerClient()
      .from("users")
      .insert({
        clerk_user_id: id,
        email,
        name: username,
      })
      .select("id");

    if (!data?.[0].id) {
      throw new Error("Failed to create user.");
    }

    return data[0].id;
  });
