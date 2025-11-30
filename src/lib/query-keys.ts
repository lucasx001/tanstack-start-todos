export const queryKeys = {
  todos: {
    list: () => ["todos", "list"],
    get: (id: string) => ["todos", "get", id],
  },
};
