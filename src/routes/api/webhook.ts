import { createFileRoute } from "@tanstack/react-router";
import { Webhook } from "svix";
import z from "zod";
import { env } from "@/lib/env";
import { createUser } from "@/server-function/users/create";
import { deleteUser } from "@/server-function/users/delete";
import { updateUser } from "@/server-function/users/update";

const clerkUserSchema = z.object({
  id: z.string(),
  username: z.string().nullable(),
  email_addresses: z.array(
    z.object({
      email_address: z.string(),
    }),
  ),
});

const clerkEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("user.created"), data: clerkUserSchema }),
  z.object({ type: z.literal("user.updated"), data: clerkUserSchema }),
  z.object({
    type: z.literal("user.deleted"),
    data: z.object({ id: z.string() }),
  }),
]);

export const Route = createFileRoute("/api/webhook")({
  server: {
    handlers: {
      GET: async () => {
        return new Response("Welcome to clerk webhook api!");
      },
      POST: async ({ request }) => {
        console.debug("Receive webhook from clerk.");

        const payload = await request.text();
        const headers = Object.fromEntries(request.headers);

        const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
        const event = clerkEventSchema.parse(wh.verify(payload, headers));

        switch (event.type) {
          case "user.created": {
            const user = event.data;

            await createUser({
              data: {
                id: user.id,
                email: user.email_addresses[0]?.email_address ?? "",
                username: user.username ?? "",
              },
            });

            break;
          }
          case "user.updated": {
            const user = event.data;

            await updateUser({
              data: {
                id: user.id,
                email: user.email_addresses[0]?.email_address ?? "",
                username: user.username ?? "",
              },
            });
            break;
          }

          case "user.deleted": {
            const { id } = event.data;
            await deleteUser({ data: { id } });
            break;
          }
        }

        return new Response("ok");
      },
    },
  },
});
