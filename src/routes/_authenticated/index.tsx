import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Link to="/todo">Go to Todo List</Link>
    </div>
  );
}
