import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="flex flex-col w-full items-center">
      <h1>Welcome to tanstack start todos app</h1>
      <Link to="/todo">Go to Todo List</Link>
    </div>
  );
}
