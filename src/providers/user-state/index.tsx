import { useUser } from "@clerk/tanstack-react-start";
import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { PropsContext } from "./context";

export function UserStateProvider({ children }: { children?: ReactNode }) {
  const result = useUser();
  const router = useRouter();

  if (!result.isSignedIn) {
    throw router.navigate({ to: "/" });
  }

  if (!result.isLoaded) {
    return <LoadingSkeleton />;
  }

  return (
    <PropsContext.Provider
      value={{
        user: {
          name: result.user.username ?? "",
          email: result.user.emailAddresses[0]?.emailAddress ?? "",
        },
      }}
    >
      {children}
    </PropsContext.Provider>
  );
}
