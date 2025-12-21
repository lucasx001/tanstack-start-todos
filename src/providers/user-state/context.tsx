import { createContext, useContext } from "react";

interface UserState {
  email: string;
  name: string;
}

interface Props {
  user: UserState;
}

export const PropsContext = createContext<Props>(undefined!);

export function useUserState(): UserState {
  const { user } = useContext(PropsContext);

  return user;
}
