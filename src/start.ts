import { clerkMiddleware } from "@clerk/tanstack-react-start/server";
import { createStart } from "@tanstack/react-start";

export const startInstance = createStart(() => {
  // nowadays, clerk in tanstack start has bug: https://github.com/clerk/javascript/issues/6996
  return {
    requestMiddleware: [clerkMiddleware({})],
  };
});
