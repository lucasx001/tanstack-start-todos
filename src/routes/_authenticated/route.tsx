import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { UserStateProvider } from "@/providers/user-state";
import { getAuthState } from "@/server-function/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { userId } = await getAuthState();

    if (!userId) {
      throw redirect({
        to: "/sign-in/$",
        search: {
          // 记录用户原本想去的页面
          redirect: location.href,
        },
      });
    }
  },
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <UserStateProvider>
      <h1 className="text-center font-bold text-2xl">Welcome to Todo App!!!</h1>
      <Outlet />
    </UserStateProvider>
  );
}
