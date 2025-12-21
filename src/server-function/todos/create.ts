import { auth, clerkClient } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getSupabaseServerClient } from "@/supabase";
import { createUser } from "../users/create";

export const createTodo = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      title: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthenticated");
    }

    const user = await clerkClient().users.getUser(userId);
    const supabaseServerClient = getSupabaseServerClient();

    const { data: supabaseUsers } = await supabaseServerClient
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId);

    let supabaseUserId = supabaseUsers?.[0]?.id;

    if (!supabaseUsers || supabaseUsers.length === 0) {
      supabaseUserId = await createUser({
        data: {
          email: user.emailAddresses[0]?.emailAddress ?? "",
          username: user.username ?? "",
          id: userId,
        },
      });
    }

    if (!supabaseUserId) {
      throw new Error("Fail to create todo.");
    }

    await supabaseServerClient.from("todos").insert({
      isCompleted: false,
      title: data.title,
      user_id: supabaseUserId,
    });
  });
