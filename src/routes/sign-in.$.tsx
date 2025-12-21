import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/sign-in/$")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <SignIn signUpUrl="/sign-up" />
    </div>
  );
}
